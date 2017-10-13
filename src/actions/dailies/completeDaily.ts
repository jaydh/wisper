import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS, OrderedSet } from 'immutable';

export interface CompleteDailyRequested {
  type: 'COMPLETE_DAILY_REQUESTED';
}

export interface CompleteDailyRejected {
  type: 'COMPLETE_DAILY_REJECTED';
}

export interface CompleteDailyFulfilled {
  type: 'COMPLETE_DAILY_FULFILLED';
  date: Date;
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

function CompleteDailyFulfilled(id: string): CompleteDailyFulfilled {
  return {
    type: 'COMPLETE_DAILY_FULFILLED',
    date: new Date(),
    id
  };
}

export default function completeDaily(id: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(CompleteDailyRequested());

    const dailyRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/completedOn'
    );

    dailyRef.once('value').then(function(snapshot: any) {
      const now = new Date();
      const update: OrderedSet<Date> = snapshot.val()
        ? fromJS(snapshot.val())
            .toOrderedSet()
            .map((t: string) => new Date(t))
            .sort()
            .add(now)
        : OrderedSet([now]);
      dailyRef
        .set(update.map((t: Date) => t.toLocaleString()).toJS())
        .then(() => {
          dispatch(CompleteDailyFulfilled(id));
        })
        .catch((error: string) => {
          console.log(error);
          dispatch(CompleteDailyRejected());
        });
    });
  };
}
