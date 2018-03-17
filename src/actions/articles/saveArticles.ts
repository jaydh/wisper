import UpdateHTML from './updateHTML';
import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export default function saveArticles() {
  const user = auth()!.currentUser!.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  return (dispatch: Dispatch<any>) =>
    articleRef
      .orderByChild('completed')
      .equalTo(false)
      .once('value')
      .then(function(snap: any) {
        let articles = snap.val();
        for (const key in articles) {
          if (key) {
            database
              .ref(`/articleData/${key}/HTMLContent`)
              .once('value')
              .then((snapIn: any) => {
                dispatch(UpdateHTML(key));
              });
          }
        }
      });
}
