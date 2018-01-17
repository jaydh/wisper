import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { Daily } from '../../constants/StoreState';
import { List } from 'immutable';
let Hashes = require('jshashes');
let SHA1 = new Hashes.SHA1();

export interface AddDailyRequested {
  type: 'ADD_DAILY_REQUESTED';
}
export interface AddDailyFulfilled {
  type: 'ADD_DAILY_FULFILLED';
  title: string;
  id: string;
}
export interface AddDailyRejected {
  type: 'ADD_DAILY_REJECTED';
}

export interface AddDaily {
  type: 'ADD_Daily';
  title: string;
}

function AddDailyRequested(): AddDailyRequested {
  return {
    type: 'ADD_DAILY_REQUESTED'
  };
}

function AddDailyRejected(): AddDailyRejected {
  return {
    type: 'ADD_DAILY_REJECTED'
  };
}

function AddDailyFulfilled(title: string): AddDailyFulfilled {
  return {
    type: 'ADD_DAILY_FULFILLED',
    title,
    id: SHA1.hex(title)
  };
}

export default function addDaily(daily: string) {
  const user = auth().currentUser.uid;

  return async (dispatch: Dispatch<any>) => {
    dispatch(AddDailyRequested());

    const hash: string = SHA1.hex(daily);
    const dailyRef = database.ref('/userData/' + user + '/dailies/' + hash);
    const set: Daily = {
      id: hash,
      title: daily,
      createdOn: new Date(),
      completedOn: List().toJS(),
      finalized: false,
      streakCount: 0
    };
    dailyRef.parent.off();

    return dailyRef
      .once('value')
      .then((snapshot: any) => {
        // Check if article in database
        if (snapshot.exists()) {
          dispatch(AddDailyRejected());
        } else {
          dailyRef.set(set).then(() => {
            dispatch(AddDailyFulfilled(daily));
          });
        }
      })
      .catch((error: string) => {
        console.log(error);
        dispatch(AddDailyRejected());
      });
  };
}
