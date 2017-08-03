import { AddArticleFulfilled } from '../actions/addArticle';
import { DeleteArticleFulfilled } from '../actions/deleteArticle';
import { ToggleArticleReadFulfilled } from '../actions/toggleArticleRead';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
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
  if (!check) {
    console.log('article in store already');
    return articleState;
  }

  return articleState.concat({
    id: action.articleHash,
    link: action.articleLink,
    dateAdded: now.toLocaleDateString(),
    completed: false
  });
}

function deleteArticle(
  articleState: List<articleType>,
  action: DeleteArticleFulfilled
) {
  return articleState.filter(
    article => (article ? article.id !== action.id : false)
  );
}

function updateArticle(articleState: List<articleType>, action: any) {
  return articleState.map(article => {
    return article && article.id === action.article.id
      ? action.article
      : article;
  });
}

function addArticleFromServer(articleState: List<articleType>, action: any) {
  let check =
    articleState.filter(article => {
      return article ? action.article.id === article.id : false;
    }).size < 1;
  console.log(check);
  console.log(articleState.push(action.article));
  return check ? articleState.push(action.article) : articleState;
}

function deleteArticleFromServer(articleState: List<articleType>, action: any) {
  return articleState.filter(
    article => (article ? article.id !== action.article.id : false)
  );
}

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

function toggleArticleRead(
  articleState: List<articleType>,
  action: ToggleArticleReadFulfilled
) {
  return articleState.map(article => {
    if (article) {
      // Only update dateRead if hasn't been read before
      const newDateRead = !article.completed
        ? now.toLocaleDateString()
        : article.dateRead;
      return article.id === action.articleHash
        ? {
            ...article,
            completed: !article.completed,
            dateRead: newDateRead,
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
  ADD_ARTICLE_TO_PROJECT: addArticleToProject,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer,
  DELETE_ARTICLE_FROM_SERVER: deleteArticleFromServer
});

export default articles;
