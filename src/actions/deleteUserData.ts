import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';

export function deleteUserData() {
  const user = auth()!.currentUser!.uid;
  const userDataRef = database.ref('/userData/' + user);

  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: 'DELETE_USER_DATA'
    });
    return userDataRef.set(null);
  };
}
