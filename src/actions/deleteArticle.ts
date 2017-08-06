import * as constants from '../constants/actionTypes';
import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';
import { ListenToFirebase } from './syncArticles';

export interface DeleteArticleRequested {
  type: constants.DELETE_ARTICLE_REQUESTED;
}
export interface DeleteArticleFulfilled {
  type: constants.DELETE_ARTICLE_FULFILLED;
  id: string;
}
export interface DeleteArticleRejected {
  type: constants.DELETE_ARTICLE_REJECTED;
}

function deleteArticleRequested(): DeleteArticleRequested {
  return {
    type: constants.DELETE_ARTICLE_REQUESTED
  };
}

function deleteArticleRejected(): DeleteArticleRejected {
  return {
    type: constants.DELETE_ARTICLE_REJECTED
  };
}

function deleteArticleFulfilled(id: string): DeleteArticleFulfilled {
  return {
    type: constants.DELETE_ARTICLE_FULFILLED,
    id: id
  };
}

export function deleteArticle(id: string) {
  return (dispatch: Dispatch<any>) => {
    dispatch(deleteArticleRequested());

    const user = auth().currentUser.uid;
    const articleRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + id
    );
    // detach listener so current action doesn't trigger server syncing
    articleRef.parent.off();

    // Check if article in database
    articleRef
      .remove()
      .then(() => {
        dispatch(deleteArticleFulfilled(id));
      })
      .catch((error: string) => {
        console.log(error);
        dispatch(deleteArticleRejected());
      });
    dispatch(ListenToFirebase);
  };
}
