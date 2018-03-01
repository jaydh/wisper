// import * as constants from '../constants/actionTypes';

export interface SetArticleListSearch {
  type: 'SET_ARTICLE_LIST_SEARCH';
  search: string;
}

export function setArticleListSearch(search: string): SetArticleListSearch {
  return {
    type: 'SET_ARTICLE_LIST_SEARCH',
    search
  };
}

export interface SetArticleListView {
  type: 'SET_ARTICLE_LIST_VIEW';
  view: string;
}

export function setArticleListView(view: string): SetArticleListView {
  return {
    type: 'SET_ARTICLE_LIST_VIEW',
    view
  };
}
