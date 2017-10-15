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

const now = new Date();

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
        dateAdded: now.toLocaleDateString(),
        completed: false,
        fetching: true,
        projects: action.project,
        viewedOn: Set()
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
  if (action.article.viewedOn) {
    action.article.viewedOn = fromJS(action.article.viewedOn)
      .toSet()
      .map((t: string) => new Date(t))
      .sort();
  }
  return articleState.map(article => {
    return article && article.id === action.article.id
      ? action.article
      : article;
  });
}

function addArticleFromServer(
  articleState: List<articleType>,
  action: AddArticleFromServer
) {
  let check =
    articleState.filter(article => {
      return article ? action.article.id === article.id : false;
    }).size === 0;
  if (action.article.viewedOn) {
    action.article.viewedOn = fromJS(action.article.viewedOn)
      .toSet()
      .map((t: string) => new Date(t))
      .sort();
  }

  return check ? articleState.push(action.article) : articleState;
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
          completedOn: t.viewedOn.add(action.date).sort()
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
            lastViewed: now
          }
        : article;
    }
    return article;
  });
}

const articles = createReducer(List(), {
  ADD_ARTICLE_FULFILLED: addArticle,
  DELETE_ARTICLE_FULFILLED: deleteArticle,
  TOGGLE_ARTICLE_READ: toggleArticleRead,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer,
  DELETE_ARTICLE_FROM_SERVER: deleteArticleFromServer,
  ARTICLE_VIEWED_FULFILLED: articleViewed
});

export default articles;
