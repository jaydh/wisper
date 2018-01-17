import { DeleteDailyFulfilled } from './../actions/dailies/deleteDaily';
import { Daily } from '../constants/StoreState';
import { fromJS, List } from 'immutable';
import {
  AddDailyFromServer,
  DeleteDailyFromServer,
  UpdateDaily
} from '../actions/syncWithFirebase';
import createReducer from './createReducer';
import { parse, isSameDay, subDays } from 'date-fns';
import { AddDailyFulfilled } from '../actions/dailies/addDaily';
import { DemoDailyCompletionBatch } from '../actions/demo/demoDailyCompletion';

function processDaily(daily: any): Daily {
  for (const x in daily) {
    if (!Object.hasOwnProperty(x)) {
      daily[x] = fromJS(daily[x]);
    }
  }

  if (daily.completedOn) {
    daily.completedOn = daily.completedOn
      .filter((t: any) => t)
      .map((t: string) => parse(t))
      .sort()
      .toMap();

    daily.completedOn.forEach((V: Date, K: number) => {
      if (isSameDay(V, daily.completedOn.get(K + 1))) {
        daily.completedOn = daily.completedOn.remove(K + 1);
      }
    });
    daily.completedOn = daily.completedOn.toList().sort();
    let streakCount = 1;
    let completedStack = daily.completedOn
      ? daily.completedOn.sort().toList()
      : List([Date()]);
    let last = new Date();
    let next = completedStack.last();
    completedStack = completedStack.pop();
    while (
      (next && isSameDay(next, subDays(last, 1))) ||
      isSameDay(next, last)
    ) {
      if (isSameDay(next, subDays(last, 1))) {
        streakCount++;
      } else if (!isSameDay(next, last)) {
        streakCount = 0;
      }
      last = next as Date;
      next = completedStack.last();
      completedStack = completedStack.pop();
    }
    daily.streakCount = streakCount;
  } else {
    daily.completedOn = List();
  }
  daily.finalized = daily.finalized ? daily.finalized : false;
  return daily;
}

function addDaily(dailyState: List<Daily>, action: AddDailyFulfilled) {
  return dailyState.find((v: Daily) => action.title === v.title)
    ? dailyState
    : dailyState
        .push({
          createdOn: new Date(),
          finalized: false,
          completedOn: List(),
          title: action.title,
          id: action.id,
          streakCount: 0
        })
        .sort((a: Daily, b: Daily) => a.title.localeCompare(b.title));
}

function addDailyFromServer(
  dailyState: List<Daily>,
  action: AddDailyFromServer
) {
  let entry = dailyState.findEntry((v: Daily) => action.daily.id === v.id);
  action.daily = processDaily(action.daily);
  if (entry) {
    if (entry[1].completedOn.equals(action.daily.completedOn)) {
      return dailyState;
    }
  }
  return entry
    ? dailyState
        .set(entry[0], action.daily)
        .sort((a: Daily, b: Daily) => a.title.localeCompare(b.title))
    : dailyState
        .push(action.daily)
        .sort((a: Daily, b: Daily) => a.title.localeCompare(b.title));
}

function deleteDailyFromServer(
  dailyState: List<Daily>,
  action: DeleteDailyFromServer
) {
  return dailyState.filter(t => (t ? t.id !== action.daily.id : false));
}

function updateDaily(dailyState: List<Daily>, action: UpdateDaily) {
  action.daily = processDaily(action.daily);
  return dailyState.set(
    dailyState.findIndex((t: Daily) => action.daily.id === t.id),
    action.daily
  );
}

function addFetchedDailies(dailyState: List<Daily>, action: any) {
  let newDailyState = dailyState;
  for (let dailyKey in action.dailies) {
    if (action.dailies.hasOwnProperty(dailyKey)) {
      const daily = action.dailies[dailyKey];
      const entry = newDailyState.findEntry((v: Daily) => daily.id === v.id);
      newDailyState = entry
        ? newDailyState.set(entry[0], processDaily(daily))
        : newDailyState.push(processDaily(daily));
    }
  }
  return newDailyState;
}

function demoDailyCompletionBatch(
  dailyState: List<Daily>,
  action: DemoDailyCompletionBatch
) {
  return dailyState
    .map((t: Daily) => {
      return t.id === action.id
        ? { ...t, completedOn: t.completedOn.concat(action.completedOn).sort() }
        : t;
    })
    .map((t: Daily) => processDaily(t));
}

function deleteDaily(articleState: List<Daily>, action: DeleteDailyFulfilled) {
  return articleState.filter(t => (t ? action.id !== t.id : false));
}

export default createReducer(List(), {
  ADD_DAILY_FULFILLED: addDaily,
  ADD_DAILY_FROM_SERVER: addDailyFromServer,
  DELETE_DAILY_FROM_SERVER: deleteDailyFromServer,
  UPDATE_DAILY: updateDaily,
  ADD_FETCHED_DAILIES: addFetchedDailies,
  DEMO_DAILY_COMPLETION_BATCH: demoDailyCompletionBatch,
  DELETE_DAILY_FULFILLED: deleteDaily
});
