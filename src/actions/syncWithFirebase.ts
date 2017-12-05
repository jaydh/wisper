import { auth, database } from '../firebase';
// import * as constants from '../constants/actionTypes';
import { Dispatch } from 'react-redux';
import { Article as articleType, Daily } from '../constants/StoreState';

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
  project: {
    id: string;
    dictionary?: any;
  };
}

export interface UpdateProject {
  type: 'UPDATE_PROJECT';
  project: any;
}

export interface DeleteProject {
  type: 'DELETE_PROJECT';
  project: any;
}

function updateArticle(article: articleType) {
  return {
    type: 'UPDATE_ARTICLE',
    article
  };
}

export function addArticleFromServer(article: articleType) {
  return {
    type: 'ADD_ARTICLE_FROM_SERVER',
    article
  };
}

function deleteArticleFromServer(article: articleType) {
  return {
    type: 'DELETE_ARTICLE_FROM_SERVER',
    article
  };
}

export function updateProject(project: any) {
  return {
    type: 'UPDATE_PROJECT',
    project
  };
}

export function addProject(project: any) {
  return {
    type: 'ADD_PROJECT',
    project
  };
}

function deleteProject(project: any) {
  return {
    type: 'DELETE_PROJECT',
    project
  };
}

export interface AddDailyFromServer {
  type: 'ADD_DAILY_FROM_SERVER';
  daily: Daily;
}

export interface DeleteDailyFromServer {
  type: 'DELETE_DAILY_FROM_SERVER';
  daily: Daily;
}

export interface UpdateDaily {
  type: 'UPDATE_DAILY';
  daily: Daily;
}

function addDailyFromServer(daily: Daily) {
  return {
    type: 'ADD_DAILY_FROM_SERVER',
    daily
  };
}

function deleteDailyFromServer(daily: Daily) {
  return {
    type: 'DELETE_DAILY_FROM_SERVER',
    daily
  };
}

function updateDaily(daily: Daily) {
  return {
    type: 'UPDATE_DAILY',
    daily
  };
}

function fetchingArticlesRequested() {
  return {
    type: 'FETCHING_ARTICLES_REQUESTED'
  };
}

function fetchingDailiesRequested() {
  return {
    type: 'FETCHING_DAILIES_REQUESTED'
  };
}
function fetchingArticlesCompleted() {
  return {
    type: 'FETCHING_ARTICLES_COMPLETED'
  };
}

function fetchingDailiesCompleted() {
  return {
    type: 'FETCHING_DAILIES_COMPLETED'
  };
}

export function pullFromFirebase() {
  const user = auth().currentUser.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  const projectRef = database.ref('/userData/' + user + '/projects/');
  const dailyRef = database.ref('/userData/' + user + '/dailies/');

  return async (dispatch: Dispatch<any>) => {
    dispatch(fetchingArticlesRequested());
    await articleRef.on('child_added', function(snap: any) {
      dispatch(addArticleFromServer(snap.val()));
    });
    dispatch(fetchingArticlesCompleted());

    await projectRef.on('child_added', function(snapshot: any) {
      dispatch(addProject(snapshot.val()));
    });

    dispatch(fetchingDailiesRequested());
    await dailyRef.on('child_added', function(snapshot: any) {
      dispatch(addDailyFromServer(snapshot.val()));
    });
    dispatch(fetchingDailiesCompleted());
  };
}

export function ListenToFirebase() {
  const user = auth().currentUser.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  const projectRef = database.ref('/userData/' + user + '/projects/');
  const dailyRef = database.ref('/userData/' + user + '/dailies/');

  return async (dispatch: Dispatch<any>) => {
    await projectRef.on('child_changed', function(snapshot: any) {
      dispatch(updateProject(snapshot.val()));
    });

    await projectRef.on('child_removed', function(snapshot: any) {
      dispatch(deleteProject(snapshot.val()));
    });
    await articleRef.on('child_changed', function(snapshot: any) {
      dispatch(updateArticle(snapshot.val()));
    });

    await articleRef.on('child_removed', function(snap: any) {
      dispatch(deleteArticleFromServer(snap.val()));
    });

    await dailyRef.on('child_removed', function(snapshot: any) {
      dispatch(deleteDailyFromServer(snapshot.val()));
    });
    await dailyRef.on('child_changed', function(snapshot: any) {
      dispatch(updateDaily(snapshot.val()));
    });
  };
}
