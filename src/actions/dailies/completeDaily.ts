import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { parse, isSameDay } from 'date-fns';

export interface CompleteDailyRequested {
  type: 'COMPLETE_DAILY_REQUESTED';
}

export interface CompleteDailyRejected {
  type: 'COMPLETE_DAILY_REJECTED';
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

export default function completeDaily(
  id: string,
  completionDate: Date = new Date()
) {
  const user = auth().currentUser.uid;
  return async (dispatch: Dispatch<any>, getState: Function) => {
    const dailyRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/completedOn'
    );

    dispatch(CompleteDailyRequested());
    return dailyRef
      .once('value')
      .then(function(snapshot: any) {
        let update = snapshot.val()
          ? fromJS(snapshot.val())
              .map((t: string) => parse(t))
              .filter((t: Date) => !isNaN(t.getTime()))
              .toList()
              .push(completionDate)
              .sort()
              .toMap()
          : Map({ 0: completionDate });
        // Remove dupes
        update.forEach((V: Date, K: number) => {
          if (isSameDay(V, update.get(K + 1))) {
            update = update.remove(K);
          }
        });
        return update;
      })
      .then(update =>
        dailyRef.set(
          update
            .toSet()
            .sort()
            .map((t: Date) => t.getTime())
            .toJS()
        )
      )
      .catch((error: string) => {
        console.log(error);
        dispatch(CompleteDailyRejected());
      });
  };
}
