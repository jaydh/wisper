import { auth, database } from '../../firebase';

export default function addArticleToProject(
  articleID: string,
  bookmark: string
) {
  const user = auth().currentUser.uid;
  const ref = database.ref(
    '/userData/' + user + '/' + 'articles/' + articleID + '/bookmark'
  );

  return ref.set(bookmark);
}
