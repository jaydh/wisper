import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';

export interface SetCurrentArticle {
  type: 'SET_CURRENT_ARTICLE';
  id?: string;
}
function setCurrentArticleSuccess(id?: string): SetCurrentArticle {
  return {
    type: 'SET_CURRENT_ARTICLE',
    id
  };
}
export interface SetCurrentHTML {
  type: 'SET_CURRENT_HTML';
  content?: string;
}

function setCurrentHTML(content?: string): SetCurrentHTML {
  return {
    type: 'SET_CURRENT_HTML',
    content
  };
}

export function setCurrentArticleFromServer(id: string) {
  return {
    type: 'SET_CURRENT_ARTICLE_FROM_SERVER',
    id
  };
}

export default function SetCurrentArticle(id?: string) {
  const user = auth().currentUser.uid;
  const ref = database.ref('/userData/' + user + '/currentArticle');

  return async (dispatch: Dispatch<any>) =>
    id
      ? ref
          .set(id)
          .then(() => {
            dispatch(setCurrentArticleSuccess(id));
          })
          .then(() =>
            database
              .ref('/articleHTMLData/' + id + '/HTMLContent')
              .once('value', (snapshot: any) =>
                dispatch(setCurrentHTML(snapshot.val()))
              )
          )
          .catch((error: string) => {
            console.log(error);
          })
      : ref.remove().then(() => {
          dispatch(setCurrentArticleSuccess());
          dispatch(setCurrentHTML());
        });
}
