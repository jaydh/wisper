import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { ListenForDailyUpdates } from '../syncWithFirebase';

export interface FinalizeDailyRequested {
  type: 'FINALIZE_DAILY_REQUESTED';
}

export interface FinalizeDailyRejected {
  type: 'FINALIZE_DAILY_REJECTED';
}

export interface FinalizeDailyFulfilled {
  type: 'FINALIZE_DAILY_FULFILLED';
  id: string;
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

function finalizeDailyFulfilled(id: string): FinalizeDailyFulfilled {
  return {
    type: 'FINALIZE_DAILY_FULFILLED',
    id
  };
}
export default function finalizeDaily(id: string) {
  const user = auth().currentUser.uid;
  return async (dispatch: Dispatch<any>, getState: Function) => {
    const dailyRef = database.ref(
      '/userData/' + user + '/dailies/' + id + '/finalized'
    );

    dispatch(finalizeDailyRequested());
    // Turn off listener for changes in dailes on server
    dailyRef.parent.parent.off('child_changed');
    return dailyRef
      .set(true)
      .then(() => dispatch(finalizeDailyFulfilled(id)))
      .then(() => dispatch(ListenForDailyUpdates()))
      .catch((error: string) => {
        console.log(error);
        dispatch(finalizeDailyRejected());
      });
  };
}
