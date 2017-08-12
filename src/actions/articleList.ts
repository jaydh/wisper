// import * as constants from '../constants/actionTypes';

export interface AddArticleList {
  type: 'ADD_ARTICLE_LIST';
}

export function AddArticleList(): AddArticleList {
  return {
    type: 'ADD_ARTICLE_LIST'
  };
}

export interface DeleteArticleList {
  type: 'DELETE_ARTICLE_LIST';
  id: string;
}

export function DeleteArticleList(id: string): DeleteArticleList {
  return {
    type: 'DELETE_ARTICLE_LIST',
    id
  };
}
