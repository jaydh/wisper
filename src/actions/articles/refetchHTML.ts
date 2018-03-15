import { database } from '../../firebase';
import { Dispatch } from 'react-redux';

export default function refetchHTML(id: string) {
  return (dispatch: Dispatch<any>) => {
    const articleRef = database.ref(`/articleData/${id}/refetch`);
    return articleRef.remove().then(() => articleRef.set(true));
  };
}
