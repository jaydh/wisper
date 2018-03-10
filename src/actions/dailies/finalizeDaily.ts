import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { ListenForDailyUpdates } from '../syncWithFirebase';

export interface FinalizeDailyRequested {
  type: 'FINALIZE_DAILY_REQUESTED';
}

export interface FinalizeDailyRejected {
  type: 'FINALIZE_DAILY_REJECTED';
}

function finalizeDailyRequested(): FinalizeDailyRequested {
  return {
    type: 'FINALIZE_DAILY_REQUESTED'
  };
}

function finalizeDailyRejected(): FinalizeDailyRejected {
  return {
    type: 'FINALIZE_DAILY_REJECTED'
  };
}

export default function finalizeDaily(id: string) {
  const user = auth()!.currentUser!.uid;
  return async (dispatch: Dispatch<any>, getState: Function) => {
    const dailyRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/finalized'
    );

    dispatch(finalizeDailyRequested());
    return dailyRef.once('value').then((snap: any) =>
      dailyRef
        .set(!snap.val())
        .then(() => dispatch(ListenForDailyUpdates()))
        .catch((error: string) => {
          console.log(error);
          dispatch(finalizeDailyRejected());
        })
    );
  };
}
