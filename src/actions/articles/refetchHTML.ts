import { database } from '../../firebase';
import updateHTML from './updateHTML';
import updateMetadata from './updateMetadata';
import updateFetching from './updateFetching';
export default function refetchHTML(id: string) {
  return dispatch => {
    const articleRef = database.ref(`/articleData/${id}`);
    dispatch(updateFetching(id, true));
    // Trigger cloud function that listens for write on refetch
    articleRef
      .child('refetch')
      .remove()
      .then(() => articleRef.child('refetch').set(true));
    articleRef
      .child('HTMLContent')
      .on('value', (snap: any) => dispatch(updateHTML(id)));
    articleRef
      .child('metadata')
      .on('value', (snap: any) => dispatch(updateMetadata(id, snap.val())));
    articleRef.child('fetching').on('value', (snap: any) => {
      // If done fetching turn off listeners
      if (snap.val() === false) {
        articleRef.child('HTMLContent').off();
        articleRef.child('metadata').off();
      }
      dispatch(updateFetching(id, snap.val()));
    });
  };
}
