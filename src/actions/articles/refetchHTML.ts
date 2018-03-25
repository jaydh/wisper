import { auth, database } from '../../firebase';
import updateHTML from './updateHTML';
import updateMetadata from './updateMetadata';
import updateFetching from './updateFetching';
export default function refetchHTML(id: string, link: string) {
  return async dispatch => {
    const articleRef = database.ref(`/articleData/${id}`);
    const user = auth()!.currentUser!.uid;
    const userArticleRef = database.ref(`userData/${user}/articles/${id}/link`);

    await articleRef
      .once('value')
      .then(
        (snap: any) =>
          !snap.val() || !snap.val().link
            ? userArticleRef.remove().then(() => {
                userArticleRef.set(link);
              })
            : articleRef
                .child('refetch')
                .remove()
                .then(() => articleRef.child('refetch').set(true))
      )
      .then(() => articleRef.child('fetching').set(true));

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
