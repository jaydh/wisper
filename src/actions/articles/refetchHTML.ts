import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { setCurrentHTML } from '../ui/setCurrentArticle';

export default function refetchHTML(id: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    const articleRef = database.ref(`/userData/${user}/articles/${id}/refetch`);
    database.ref(`/articleData/${id}/HTMLContent`).on('value', (data: any) => {
      console.log(data.val());
      dispatch(setCurrentHTML(data.val()));
      database.ref(`/articleData/${id}/HTMLContent`).off();
    });
    return articleRef.set(true);
  };
}
