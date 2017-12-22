import { AddArticleFulfilled } from '../actions/articles/addArticle';
import { DeleteArticleFulfilled } from '../actions/articles/deleteArticle';
import { ToggleArticleReadFulfilled } from '../actions/articles/toggleArticleRead';
import { ArticleViewedFulfilled } from '../actions/articles/articleViewed';
import {
  UpdateArticle,
  AddArticleFromServer,
  DeleteArticleFromServer
} from '../actions/syncWithFirebase';
import { Article as articleType } from '../constants/StoreState';
import { fromJS, List, Set } from 'immutable';
import createReducer from './createReducer';

function processArticle(article: any): articleType {
  for (const x in article) {
    if (!Object.hasOwnProperty(x)) {
      article[x] = fromJS(article[x]);
    }
  }
  article.projects = article.projects ? article.projects.valueSeq() : Set();
  article.viewedOn = article.viewedOn
    ? fromJS(article.viewedOn)
        .toSet()
        .map((t: string) => new Date(t))
        .sort()
    : Set();
  article.dateAdded = article.dateAdded ? new Date(article.dateAdded) : null;
  article.dateRead = article.dateRead ? new Date(article.dateRead) : null;

  return article;
}

function addArticle(
  articleState: List<articleType>,
  action: AddArticleFulfilled
) {
  let check =
    articleState.filter(article => {
      return article ? action.articleHash === article.id : false;
    }).size === 0;

  return check
    ? articleState.push({
        id: action.articleHash,
        link: action.articleLink,
        dateAdded: new Date(),
        completed: false,
        fetching: true,
        viewedOn: Set(),
        projects: Set()
      })
    : articleState;
}

function deleteArticle(
  articleState: List<articleType>,
  action: DeleteArticleFulfilled
) {
  return articleState.filter(
    article => (article ? article.id !== action.id : false)
  );
}

function updateArticle(articleState: List<articleType>, action: UpdateArticle) {
  return articleState.map(article => {
    return article && article.id === action.article.id
      ? processArticle(action.article)
      : article;
  });
}

function addArticleFromServer(
  articleState: List<articleType>,
  action: AddArticleFromServer
) {
  let entry = articleState.findEntry(
    (v: articleType) => action.article.id === v.id
  );
  action.article = processArticle(action.article);
  if (entry) {
    if (
      entry[1].projects.equals(action.article.projects) &&
      entry[1].viewedOn.equals(action.article.viewedOn)
    ) {
      return articleState;
    }
  }

  return entry
    ? articleState.set(entry[0], action.article)
    : articleState.push(action.article);
}

function deleteArticleFromServer(
  articleState: List<articleType>,
  action: DeleteArticleFromServer
) {
  return articleState.filter(
    article => (article ? article.id !== action.article.id : false)
  );
}

function articleViewed(
  dailyState: List<articleType>,
  action: ArticleViewedFulfilled
) {
  return dailyState.map((t: articleType) => {
    return t.id === action.id
      ? {
          ...t,
          viewedOn: t.viewedOn.add(action.date).sort()
        }
      : t;
  });
}

function toggleArticleRead(
  articleState: List<articleType>,
  action: ToggleArticleReadFulfilled
) {
  return articleState.map(article => {
    if (article) {
      return article.id === action.articleHash
        ? {
            ...article,
            completed: action.update.completed,
            dateRead: action.update.dateRead,
            lastViewed: new Date()
          }
        : article;
    }
    return article;
  });
}

function addFetchedArticles(articleState: List<articleType>, action: any) {
  let newArticleState = articleState;
  for (let articleKey in action.articles) {
    if (action.articles.hasOwnProperty(articleKey)) {
      const article = action.articles[articleKey];
      const entry = newArticleState.findEntry(
        (v: articleType) => article.id === v.id
      );
      newArticleState = entry
        ? newArticleState.set(entry[0], processArticle(article))
        : newArticleState.push(processArticle(article));
    }
  }
  return newArticleState;
}

const articles = createReducer(List(), {
  ADD_ARTICLE_FULFILLED: addArticle,
  DELETE_ARTICLE_FULFILLED: deleteArticle,
  TOGGLE_ARTICLE_READ: toggleArticleRead,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer,
  DELETE_ARTICLE_FROM_SERVER: deleteArticleFromServer,
  ARTICLE_VIEWED_FULFILLED: articleViewed,
  ADD_FETCHED_ARTICLES: addFetchedArticles
});

export default articles;
