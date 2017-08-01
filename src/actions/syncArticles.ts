import { auth, database } from '../firebase';
import * as constants from '../constants/actionTypes';
import { Dispatch } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
export interface SyncArticlesRequested {
  type: constants.SYNC_ARTICLES_REQUESTED;
}

export interface SyncArticlesFulfilled {
  type: constants.SYNC_ARTICLES_FULFILLED;
  articles: articleType[];
}
export interface SyncArticlesRejected {
  type: constants.SYNC_ARTICLES_REJECTED;
}

function SyncArticlesRequested(): SyncArticlesRequested {
  return {
    type: constants.SYNC_ARTICLES_REQUESTED
  };
}

function SyncArticlesRejected(): SyncArticlesRejected {
  return {
    type: constants.SYNC_ARTICLES_REJECTED
  };
}

function SyncArticlesFulfilled(articles: articleType[]): SyncArticlesFulfilled {
  return {
    type: constants.SYNC_ARTICLES_FULFILLED,
    articles: articles
  };
}

function UpdateArticle(article: articleType) {
  return {
    type: 'UPDATE_ARTICLE',
    article
  };
}

function AddArticleFromServer(article: articleType) {
  return {
    type: 'ADD_ARTICLE_FROM_SERVER',
    article
  };
}

export function ListenToFirebase() {
  const user = auth().currentUser.uid;
  const ref = database.ref('/userData/' + user + '/articles/');

  return (dispatch: Dispatch<any>) => {
    ref.on('child_changed', function(snapshot: any) {
      dispatch(UpdateArticle(snapshot.val()));
      console.log(snapshot.val());
    });

    ref.on('child_added', function(snap: any) {
      dispatch(AddArticleFromServer(snap.val()));
    });

    //child deleted
  };
}

export function SyncArticles() {
  const user = auth().currentUser.uid;

  return (dispatch: Dispatch<any>) => {
    const ref = database.ref('/userData/' + user + '/articles/');
    ref.once('value', function(snap: any) {
      dispatch(SyncArticlesRequested());
      const article = snap.val();
      dispatch(SyncArticlesFulfilled(article));
    });
  };
}
