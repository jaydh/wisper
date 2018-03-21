import { AddArticleFulfilled } from '../actions/articles/addArticle';
import { DeleteArticleFulfilled } from '../actions/articles/deleteArticle';
import {
  UpdateArticle,
  AddArticleFromServer,
  DeleteArticleFromServer
} from '../actions/syncWithFirebase';
import { UpdateMetadata } from '../actions/articles/updateMetadata';
import { UpdateFetching } from '../actions/articles/updateFetching';
import { Article as articleType } from '../constants/StoreState';
import { fromJS, List, Set, Map } from 'immutable';
import createReducer from './createReducer';

function processArticle(article: any): articleType {
  for (const x in article) {
    if (!Object.hasOwnProperty(x)) {
      article[x] = fromJS(article[x]);
    }
  }
  article.projects = article.projects
    ? article.projects.valueSeq().sort()
    : Set();
  article.viewedOn = article.viewedOn
    ? fromJS(article.viewedOn)
        .toSet()
        .map((t: string) => new Date(t))
        .sort()
    : Set();
  article.metadata = article.metadata
    ? fromJS(article.metadata)
    : Map<string, any>();
  article.dateAdded = article.dateAdded ? new Date(article.dateAdded) : null;
  article.dateRead = article.dateRead ? new Date(article.dateRead) : null;
  const hasTitle =
    article.metadata.has('title') || article.metadata.has('oGtitle');
  article.title = hasTitle
    ? article.metadata.get('title') || article.metadata.get('ogTitle')
    : article.link;

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
        title: action.articleLink,
        dateAdded: new Date(),
        completed: false,
        fetching: true,
        viewedOn: Set(),
        projects: Set(),
        metadata: action.metadata
          ? fromJS(action.metadata)
          : Map<string, any>(),
        progress: 0
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
  return articleState.map((article: articleType) => {
    return article && article.id === action.article.id
      ? processArticle(Object.assign({}, article, action.article))
      : article;
  });
}

function addArticleFromServer(
  articleState: List<articleType>,
  action: AddArticleFromServer
) {
  const entry = articleState.findEntry(
    (v: articleType) => action.article.id === v.id
  );
  return entry
    ? articleState.set(
        entry[0],
        processArticle(Object.assign({}, entry[1], action.article))
      )
    : articleState.push(processArticle(action.article));
}

function deleteArticleFromServer(
  articleState: List<articleType>,
  action: DeleteArticleFromServer
) {
  return articleState.filter(
    article => (article ? article.id !== action.article.id : false)
  );
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
        ? newArticleState.set(
            entry[0],
            processArticle(Object.assign({}, entry[1], article))
          )
        : newArticleState.push(processArticle(article));
    }
  }
  return newArticleState;
}

function updateMetadata(
  articleState: List<articleType>,
  action: UpdateMetadata
) {
  return articleState.map((t: articleType) => {
    return t.id === action.id
      ? {
          ...t,
          metadata: action.value ? fromJS(action.value) : Map<string, any>()
        }
      : t;
  });
}

function updateHTML(articleState: List<articleType>, action: UpdateMetadata) {
  return articleState.map((t: articleType) => {
    return t.id === action.id
      ? {
          ...t,
          HTMLContent: action.value
        }
      : t;
  });
}

function updateFetching(
  articleState: List<articleType>,
  action: UpdateFetching
) {
  return articleState.map((t: articleType) => {
    return t.id === action.id ? { ...t, fetching: action.fetching } : t;
  });
}

const articles = createReducer(List(), {
  ADD_ARTICLE_FULFILLED: addArticle,
  DELETE_ARTICLE_FULFILLED: deleteArticle,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer,
  DELETE_ARTICLE_FROM_SERVER: deleteArticleFromServer,
  ADD_FETCHED_ARTICLES: addFetchedArticles,
  UPDATE_METADATA: updateMetadata,
  UPDATE_FETCHING: updateFetching,
  UPDATE_HTML: updateHTML
});

export default articles;
