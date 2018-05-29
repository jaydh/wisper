import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export interface SetCurrentArticle {
  type: 'SET_CURRENT_ARTICLE';
  id: string | null;
}
function setCurrentArticleSuccess(id: string | null): SetCurrentArticle {
  return {
    type: 'SET_CURRENT_ARTICLE',
    id
  };
}

export function setCurrentArticleFromServer(id: string) {
  return {
    type: 'SET_CURRENT_ARTICLE_FROM_SERVER',
    id
  };
}

export default function SetCurrentArticle(id: string | null) {
  const user = auth()!.currentUser!.uid;
  const ref = database.ref('/userData/' + user + '/currentArticle');
  return async (dispatch: Dispatch<any>) => {
    dispatch(setCurrentArticleSuccess(id));
    return id
      ? ref.set(id).catch((error: string) => {
          console.log(error);
        })
      : ref.remove();
  };
}
