// import * as constants from '../constants/actionTypes';

export interface AddArticleList {
  type: 'ADD_ARTICLE_LIST';
  id?: string;
}

export function addArticleList(id?: string): AddArticleList {
  return {
    type: 'ADD_ARTICLE_LIST',
    id
  };
}

export interface DeleteArticleList {
  type: 'DELETE_ARTICLE_LIST';
  id: string;
}

export function deleteArticleList(id: string): DeleteArticleList {
  return {
    type: 'DELETE_ARTICLE_LIST',
    id
  };
}

export interface ResizeArticleList {
  type: 'RESIZE_ARTICLE_LIST';
  id: string;
  x: number;
  y: number;
}

export function resizeArticleList(
  id: string,
  x: number,
  y: number
): ResizeArticleList {
  return {
    type: 'RESIZE_ARTICLE_LIST',
    id,
    x,
    y
  };
}

export interface RepositionArticleList {
  type: 'REPOSITION_ARTICLE_LIST';
  id: string;
  x: number;
  y: number;
}

export function repositionArticleList(
  id: string,
  x: number,
  y: number
): RepositionArticleList {
  return {
    type: 'REPOSITION_ARTICLE_LIST',
    id,
    x,
    y
  };
}

export interface ToggleLockArticleList {
  type: 'LOCK_ARTICLE_LIST';
  id: string;
}

export function togglelockArticleList(id: string): ToggleLockArticleList {
  return {
    type: 'LOCK_ARTICLE_LIST',
    id
  };
}

export interface SetArticleListSearch {
  type: 'SET_ARTICLE_LIST_SEARCH';
  id: string;
  search: string;
}

export function setArticleListSearch(
  id: string,
  search: string
): SetArticleListSearch {
  return {
    type: 'SET_ARTICLE_LIST_SEARCH',
    id,
    search
  };
}

export interface SetArticleListView {
  type: 'SET_ARTICLE_LIST_VIEW';
  id: string;
  view: string;
}

export function setArticleListView(
  id: string,
  view: string
): SetArticleListView {
  return {
    type: 'SET_ARTICLE_LIST_VIEW',
    id,
    view
  };
}
