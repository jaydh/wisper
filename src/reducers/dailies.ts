import { CompleteDailyFulfilled } from './../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { fromJS, List, OrderedSet } from 'immutable';
import {
  AddDailyFromServer,
  DeleteDailyFromServer
} from '../actions/syncWithFirebase';

import createReducer from './createReducer';

function addDaily(dailyState: List<Daily>, action: any) {
  let check =
    dailyState.filter(daily => {
      return daily ? action.id === daily.id : false;
    }).size === 0;
  return check
    ? dailyState.push({
        id: action.id,
        title: action.title,
        createdOn: new Date(),
        completedOn: OrderedSet(),
        completed: false
      })
    : dailyState;
}

function addDailyFromServer(
  dailyState: List<Daily>,
  action: AddDailyFromServer
) {
  if (action.daily.completedOn) {
    action.daily.completedOn = fromJS(action.daily.completedOn)
      .toSet()
      .map((t: string) => new Date(t));
  }
  let check =
    dailyState.filter(daily => {
      return daily ? action.daily.id === daily.id : false;
    }).size === 0;

  return check ? dailyState.push(action.daily) : dailyState;
}

function deleteDailyFromServer(
  articleState: List<Daily>,
  action: DeleteDailyFromServer
) {
  return articleState.filter(t => (t ? t.id !== action.daily.id : false));
}

function completeDaily(
  dailyState: List<Daily>,
  action: CompleteDailyFulfilled
) {
  return dailyState.map((t: Daily) => {
    if (t.id === action.id) {
      t.completedOn = t.completedOn
        ? t.completedOn.add(action.date)
        : OrderedSet([action.date]);
    }
    return t;
  });
}

export default createReducer(List(), {
  ADD_DAILY_FULFILLED: addDaily,
  COMPLETE_DAILY_FULFILLED: completeDaily,
  ADD_DAILY_FROM_SERVER: addDailyFromServer,
  DELETE_DAILY_FROM_SERVER: deleteDailyFromServer
});
