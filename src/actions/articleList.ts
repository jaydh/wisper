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
