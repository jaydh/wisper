import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export interface DeleteDailyRequested {
  type: 'DELETE_DAILY_REQUESTED';
}
export interface DeleteDailyFulfilled {
  type: 'DELETE_DAILY_FULFILLED';
  id: string;
}
export interface DeleteDailyRejected {
  type: 'DELETE_DAILY_REJECTED';
}

function deleteArticleRequested(): DeleteDailyRequested {
  return {
    type: 'DELETE_DAILY_REQUESTED'
  };
}

function deleteArticleRejected(): DeleteDailyRejected {
  return {
    type: 'DELETE_DAILY_REJECTED'
  };
}

function deleteArticleFulfilled(id: string): DeleteDailyFulfilled {
  return {
    type: 'DELETE_DAILY_FULFILLED',
    id: id
  };
}

export default function deleteDaily(id: string) {
  return (dispatch: Dispatch<any>) => {
    dispatch(deleteArticleRequested());

    const user = auth().currentUser.uid;
    const dailyRef = database.ref(
      '/userData/' + user + '/' + 'dailies/' + id
    );

    // Check if article in database
    dailyRef
      .remove()
      .then(() => {
        dispatch(deleteArticleFulfilled(id));
      })
      .catch((error: string) => {
        console.log(error);
        dispatch(deleteArticleRejected());
      });
  };
}
