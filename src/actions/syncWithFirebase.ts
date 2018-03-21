import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';
import {
  Article as articleType,
  Daily,
  Project
} from '../constants/StoreState';
import { setCurrentArticleFromServer } from './ui/setCurrentArticle';
import updateMetadata from './articles/updateMetadata';
import updateFetching from './articles/updateFetching';

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
  project: Project;
}

export interface UpdateProject {
  type: 'UPDATE_PROJECT';
  project: Project;
}

export interface DeleteProject {
  type: 'DELETE_PROJECT';
  project: Project;
}

function updateArticle(article: articleType) {
  return {
    type: 'UPDATE_ARTICLE',
    article
  };
}

export function addArticleFromServer(
  article: articleType
): AddArticleFromServer {
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

function addFetchedArticles(articles: any) {
  return {
    type: 'ADD_FETCHED_ARTICLES',
    articles
  };
}

function addFetchedDailies(dailies: any) {
  return {
    type: 'ADD_FETCHED_DAILIES',
    dailies
  };
}
export function pullFromFirebase() {
  const user = auth()!.currentUser!.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  const dailyRef = database.ref('/userData/' + user + '/dailies/');
  const currentArticleRef = database.ref(
    '/userData/' + user + '/currentArticle'
  );

  return async (dispatch: Dispatch<any>) => {
    dispatch(fetchingDailiesRequested());
    dispatch(fetchingArticlesRequested());
    return Promise.all([
      dailyRef.once('value').then(function(snap: any) {
        dispatch(addFetchedDailies(snap.val()));
        dispatch(fetchingDailiesCompleted());
      }),
      currentArticleRef
        .once('value')
        .then((snap: any) => dispatch(setCurrentArticleFromServer(snap.val()))),
      articleRef
        .orderByChild('completed')
        .equalTo(false)
        .once('value')
        .then(function(snap: any) {
          let articles = snap.val();
          let promises: any = [];
          for (const key in articles) {
            if (key) {
              promises.push(
                database
                  .ref(`/articleData/${key}/metadata`)
                  .once('value')
                  .then((snapIn: any) => {
                    articles[key].metadata = snapIn.val();
                    return articles[key];
                  })
              );
            }
          }
          return Promise.all(promises);
        })
        .then((articles: any) => {
          dispatch(addFetchedArticles(articles));
          dispatch(fetchingArticlesCompleted());
        })
    ]);
  };
}

export function pullCompletedArticles() {
  const user = auth()!.currentUser!.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');

  return async (dispatch: Dispatch<any>) =>
    articleRef
      .orderByChild('completed')
      .equalTo(true)
      .once('value')
      .then(function(snap: any) {
        let articles = snap.val();
        let promises: any = [];
        for (const key in articles) {
          if (key) {
            promises.push(
              database
                .ref(`/articleData/${key}/metadata`)
                .once('value')
                .then((snapIn: any) => {
                  articles[key].metadata = snapIn.val();
                  return articles[key];
                })
            );
          }
        }
        return Promise.all(promises);
      })
      .then((articles: any) => dispatch(addFetchedArticles(articles)));
}

export function ListenForDailyUpdates() {
  const user = auth()!.currentUser!.uid;
  const dailyRef = database.ref('/userData/' + user + '/dailies/');

  return (dispatch: Dispatch<any>) => {
    dailyRef.on('child_changed', function(snapshot: any) {
      dispatch(updateDaily(snapshot.val()));
    });
  };
}

export function ListenForArticleUpdates() {
  const user = auth()!.currentUser!.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');

  return (dispatch: Dispatch<any>) => {
    articleRef.on('child_changed', function(snap: any) {
      let article = snap.val();
      const id = article.id;
      dispatch(updateArticle(snap.val()));
      database
        .ref(`/articleData/${id}/metadata`)
        .once('value')
        .then((snapIn: any) => dispatch(updateMetadata(id, snapIn.val())));
      database
        .ref(`/articleData/${id}/fetching`)
        .once('value')
        .then((snapIn: any) => dispatch(updateFetching(id, snapIn.val())));
    });
  };
}

export function ListenToFirebase() {
  const user = auth()!.currentUser!.uid;
  const articleRef = database.ref('/userData/' + user + '/articles/');
  const dailyRef = database.ref('/userData/' + user + '/dailies/');
  const projectRef = database.ref('userData/' + user + '/projects');

  return (dispatch: Dispatch<any>) => {
    dispatch(ListenForDailyUpdates());
    dispatch(ListenForArticleUpdates());

    projectRef.on('child_added', function(snapshot: any) {
      dispatch(addProject(snapshot.val()));
    });
    projectRef.on('child_changed', function(snapshot: any) {
      dispatch(updateProject(snapshot.val()));
    });
    projectRef.on('child_removed', function(snapshot: any) {
      dispatch(deleteProject(snapshot.val()));
    });
    articleRef
      .orderByChild('completed')
      .equalTo(false)
      .on('child_added', function(snap: any) {
        let article = snap.val();
        const id = article.id;
        database
          .ref(`/articleData/${id}/metadata`)
          .once('value')
          .then((snapIn: any) => {
            article.metadata = snapIn.val();
            dispatch(addArticleFromServer(article));
          });
      });
    articleRef.on('child_removed', function(snap: any) {
      dispatch(deleteArticleFromServer(snap.val()));
    });
    dailyRef.on('child_added', function(snapshot: any) {
      dispatch(addDailyFromServer(snapshot.val()));
    });
    dailyRef.on('child_removed', function(snapshot: any) {
      dispatch(deleteDailyFromServer(snapshot.val()));
    });
  };
}
