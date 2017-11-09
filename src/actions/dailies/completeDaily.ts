import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS, OrderedSet } from 'immutable';
import { Daily } from '../../constants/StoreState';
import { Moment } from 'moment';
import * as moment from 'moment';

export interface CompleteDailyRequested {
  type: 'COMPLETE_DAILY_REQUESTED';
}

export interface CompleteDailyRejected {
  type: 'COMPLETE_DAILY_REJECTED';
}

export interface CompleteDailyFulfilled {
  type: 'COMPLETE_DAILY_FULFILLED';
  date: Moment;
  id: string;
}
function CompleteDailyRequested(): CompleteDailyRequested {
  return {
    type: 'COMPLETE_DAILY_REQUESTED'
  };
}

function CompleteDailyRejected(): CompleteDailyRejected {
  return {
    type: 'COMPLETE_DAILY_REJECTED'
  };
}

function CompleteDailyFulfilled(
  id: string,
  date: Moment
): CompleteDailyFulfilled {
  return {
    type: 'COMPLETE_DAILY_FULFILLED',
    date,
    id
  };
}
export default function completeDaily(
  id: string,
  completionDate: Moment = moment()
) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>, getState: Function) => {
    dispatch(CompleteDailyRequested());

    const dailyRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/completedOn'
    );

    const streakRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/streakCount'
    );

    return dailyRef.once('value').then(function(snapshot: any) {
      const update: OrderedSet<Moment> = snapshot.val()
        ? fromJS(snapshot.val())
            .toOrderedSet()
            .map((t: string) => moment(t))
            .sort()
            .add(completionDate)
        : OrderedSet([completionDate]);
      return dailyRef
        .set(update.map((t: Moment) => t.toLocaleString()).toJS())
        .then(() => {
          dispatch(CompleteDailyFulfilled(id, completionDate));
        })
        .then(() => {
          streakRef.set(
            getState()
              .get('dailies')
              .find((t: Daily) => id === t.id).streakCount
          );
        })
        .catch((error: string) => {
          console.log(error);
          dispatch(CompleteDailyRejected());
        });
    });
  };
}
