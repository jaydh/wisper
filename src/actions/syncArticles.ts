import { auth, database } from '../firebase';
// import * as constants from '../constants/actionTypes';
import { Dispatch } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';

// todo: add types

export interface AddArticleFromServer {
  type: 'ADD_ARTICLE_FROM_SERVER';
  article: articleType;
}

function UpdateArticle(article: articleType) {
  return {
    type: 'UPDATE_ARTICLE',
    article
  };
}

export function AddArticleFromServer(article: articleType) {
  return {
    type: 'ADD_ARTICLE_FROM_SERVER',
    article
  };
}

function DeleteArticleFromServer(article: articleType) {
  return {
    type: 'DELETE_ARTICLE_FROM_SERVER',
    article
  };
}

export function ListenToFirebase() {
  const user = auth().currentUser.uid;
  const ref = database.ref('/userData/' + user + '/articles/');

  return (dispatch: Dispatch<any>) => {
    ref.on('child_changed', function(snapshot: any) {
      dispatch(UpdateArticle(snapshot.val()));
    });

    ref.on('child_added', function(snap: any) {
      dispatch(AddArticleFromServer(snap.val()));
    });

    ref.on('child_removed', function(snap: any) {
      dispatch(DeleteArticleFromServer(snap.val()));
    });
  };
}
