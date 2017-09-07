import { auth, database } from '../firebase';
// import * as constants from '../constants/actionTypes';
import { Dispatch } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import { fromJS } from 'immutable';

export interface AddArticleFromServer {
  type: 'ADD_ARTICLE_FROM_SERVER';
  article: articleType;
}

export interface UpdateArticle {
  type: 'UPDATE_ARTICLE';
  article: articleType;
}

export interface DeleteArticleFromServer {
  type: 'DELETE_ARTICLE_FROM_SERVER';
  article: articleType;
}

export interface AddProject {
  type: 'ADD_PROJECT';
  project: any;
}

export interface UpdateProject {
  type: 'UPDATE_PROJECT';
  project: any;
}

export interface DeleteProject {
  type: 'DELETE_PROJECT';
  project: any;
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

export function UpdateProject(project: any) {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
}

export function AddProject(project: any) {
  return {
    type: 'ADD_PROJECT',
    project
  };
}

function DeleteProject(project: any) {
  return {
    type: 'DELETE_PROJECT',
    project
  };
}

export function ListenToFirebase() {
  const user = auth().currentUser.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  const projectRef = database.ref('/userData/' + user + '/projects/');

  return (dispatch: Dispatch<any>) => {
    projectRef.on('child_changed', function(snapshot: any) {
      dispatch(UpdateProject(fromJS(snapshot.val()).valueSeq()));
    });

    projectRef.on('child_added', function(snapshot: any) {
      dispatch(AddProject(snapshot.val()));
    });

    projectRef.on('child_removed', function(snapshot: any) {
      dispatch(DeleteProject(snapshot.val()));
    });
    articleRef.on('child_changed', function(snapshot: any) {
      dispatch(UpdateArticle(snapshot.val()));
    });

    articleRef.on('child_added', function(snap: any) {
      dispatch(AddArticleFromServer(snap.val()));
    });

    articleRef.on('child_removed', function(snap: any) {
      dispatch(DeleteArticleFromServer(snap.val()));
    });
  };
}
