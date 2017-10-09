import { CompleteDailyFulfilled } from './../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { fromJS, List, OrderedSet } from 'immutable';
import {
  AddDailyFromServer,
  DeleteDailyFromServer
} from '../actions/syncWithFirebase';
import createReducer from './createReducer';

function addDaily(dailyState: List<Daily>, action: any) {
  return dailyState.find((v: Daily) => action.id === v.id)
    ? dailyState
    : dailyState.push({
        createdOn: new Date(),
        completed: false,
        completedOn: OrderedSet(),
        title: action.title,
        id: action.id
      });
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
  dailyState: List<Daily>,
  action: DeleteDailyFromServer
) {
  return dailyState.filter(t => (t ? t.id !== action.daily.id : false));
}

function completeDaily(
  dailyState: List<Daily>,
  action: CompleteDailyFulfilled
) {
  const key = dailyState.findKey((t: Daily) => action.id === t.id);
  return typeof key !== 'undefined'
    ? dailyState.update(key, (t: Daily) => {
        t.completedOn = t.completedOn.add(action.date);
        console.log(t);
        return t;
      })
    : dailyState;
}

export default createReducer(List(), {
  ADD_DAILY_FULFILLED: addDaily,
  COMPLETE_DAILY_FULFILLED: completeDaily,
  ADD_DAILY_FROM_SERVER: addDailyFromServer,
  DELETE_DAILY_FROM_SERVER: deleteDailyFromServer
});
