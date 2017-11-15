import { CompleteDailyFulfilled } from './../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { fromJS, List, OrderedSet } from 'immutable';
import {
  AddDailyFromServer,
  DeleteDailyFromServer,
  UpdateDaily
} from '../actions/syncWithFirebase';
import createReducer from './createReducer';
import { isSameDay, subDays } from 'date-fns';

function addDaily(dailyState: List<Daily>, action: any) {
  return dailyState.find((v: Daily) => action.id === v.id)
    ? dailyState
    : dailyState
        .push({
          createdOn: new Date(),
          completed: false,
          completedOn: OrderedSet(),
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
  if (action.daily.completedOn) {
    action.daily.completedOn = fromJS(action.daily.completedOn)
      .toSet()
      .map((t: string) => new Date(t))
      .sort();
  }
  const entry = dailyState.findEntry((v: Daily) => action.daily.id === v.id);
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
  if (action.daily.completedOn) {
    action.daily.completedOn = fromJS(action.daily.completedOn)
      .toSet()
      .map((t: string) => new Date(t))
      .sort();
  }
  return dailyState.set(
    dailyState.findIndex((t: Daily) => action.daily.id === t.id),
    action.daily
  );
}

function completeDaily(
  dailyState: List<Daily>,
  action: CompleteDailyFulfilled
) {
  return dailyState.map((t: Daily) => {
    let streakCount = 1;
    if (t.id === action.id) {
      let completedStack = t.completedOn
        ? t.completedOn.sort().toList()
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
      return {
        ...t,
        streakCount,
        completedOn: t.completedOn.add(action.date).sort()
      };
    }
    return t;
  });
}

export default createReducer(List(), {
  ADD_DAILY_FULFILLED: addDaily,
  COMPLETE_DAILY_FULFILLED: completeDaily,
  ADD_DAILY_FROM_SERVER: addDailyFromServer,
  DELETE_DAILY_FROM_SERVER: deleteDailyFromServer,
  UPDATE_DAILY: updateDaily
});
