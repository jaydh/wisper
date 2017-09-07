import { AddArticleFulfilled } from '../actions/addArticle';
import { DeleteArticleFulfilled } from '../actions/deleteArticle';
import { ToggleArticleReadFulfilled } from '../actions/toggleArticleRead';
import { SortArticles } from '../actions/sortArticles';
import {
  UpdateArticle,
  AddArticleFromServer,
  DeleteArticleFromServer
} from '../actions/syncWithFirebase';
import { Article as articleType } from '../constants/StoreState';
import { List } from 'immutable';
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
        projects: action.project
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
  return check ? articleState.push(action.article) : articleState;
}

function sortArticles(articleState: List<articleType>, action: SortArticles) {
  switch (action.filter) {
    case 'date':
      return articleState
        .sort((a, b) => {
          const aa = new Date(a.dateAdded);
          const bb = new Date(b.dateAdded);
          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        })
        .toList();
    case 'title':
      return articleState
        .sort((a, b) => {
          const aa =
            a.metadata && (a.metadata.title || a.metadata.ogTitle)
              ? a.metadata.ogTitle || a.metadata.title
              : a.link;

          const bb =
            b.metadata && (b.metadata.title || b.metadata.ogTitle)
              ? b.metadata.ogTitle || b.metadata.title
              : b.link;
          return aa.localeCompare(bb);
        })
        .toList();
    case 'dateRead':
      return articleState
        .sort((a, b) => {
          const aa = a.dateRead ? new Date(a.dateRead) : new Date();
          const bb = b.dateRead ? new Date(b.dateRead) : new Date();
          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        })
        .toList();
    default:
      return articleState;
  }
}

function deleteArticleFromServer(
  articleState: List<articleType>,
  action: DeleteArticleFromServer
) {
  return articleState.filter(
    article => (article ? article.id !== action.article.id : false)
  );
}
/*
function addArticleToProject(
  articleState: List<articleType>,
  action: AddArticleToProjectFulfilled
) {
  return articleState.map(article => {
    return article && article.id === action.articleHash
      ? {
          ...article,
          project: action.project
        }
      : article;
  });
}
*/
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
  SORT_ARTICLES: sortArticles
});

export default articles;
