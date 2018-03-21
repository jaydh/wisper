import { database } from '../../firebase';
import { Dispatch } from 'react-redux';
import updateFetching from './updateFetching';

export interface UpdateHTML {
  type: 'UPDATE_HTML';
  id: string;
  value: any;
}

function updateHTML(id: string, value: string) {
  return {
    type: 'UPDATE_HTML',
    id,
    value
  };
}

export default (id: string) => {
  return (dispatch: Dispatch<UpdateHTML>) => {
    const ref = database.ref(`/articleData/${id}/HTMLContent`);
    dispatch(updateFetching(id, true));
    return ref
      .once('value')
      .then((snap: any) => {
        dispatch(updateHTML(id, snap.val()));
      })
      .then(() => dispatch(updateFetching(id, false)));
  };
};
