import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export default function refetchHTML(id: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    const articleRef = database.ref(
      `/userData/${user}/articles/${id}/refetch`
    );
    return articleRef.set(true);
  };
}
