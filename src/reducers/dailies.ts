import { CompleteDailyFulfilled } from './../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { fromJS, List, OrderedSet } from 'immutable';
import {
  AddDailyFromServer,
  DeleteDailyFromServer
} from '../actions/syncWithFirebase';

import createReducer from './createReducer';

function addDaily(dailyState: List<Daily>, action: any) {
  return dailyState.find((v: Daily) => action.daily.id === v.id)
    ? dailyState
    : dailyState.push(action.daily);
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
  const entry = dailyState.findEntry((v: Daily) => action.daily.id === v.id);
  return entry
    ? dailyState.set(entry[0], action.daily)
    : dailyState.push(action.daily);
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
  let [key, daily] = dailyState.findEntry((t: Daily) => action.id === t.id);
  daily.completedOn = daily.completedOn
    ? daily.completedOn.add(action.date)
    : OrderedSet([action.date]);
  return key ? dailyState.set(key, daily) : dailyState;
}

export default createReducer(List(), {
  ADD_DAILY_FULFILLED: addDaily,
  COMPLETE_DAILY_FULFILLED: completeDaily,
  ADD_DAILY_FROM_SERVER: addDailyFromServer,
  DELETE_DAILY_FROM_SERVER: deleteDailyFromServer
});
