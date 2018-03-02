import { auth, database } from '../../firebase';

export default function addArticleToProject(
  articleID: string,
  percent: number
) {
  const user = auth().currentUser.uid;
  const ref = database.ref(
    '/userData/' + user + '/' + 'articles/' + articleID + '/progress'
  );

  return !isNaN(percent) ? ref.set(percent) : null;
}
