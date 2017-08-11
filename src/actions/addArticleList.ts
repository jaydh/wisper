// import * as constants from '../constants/actionTypes';

export interface AddArticleList {
  type: 'ADD_ARTICLE_LIST';
}

export default function AddArticleList(): AddArticleList {
  return {
    type: 'ADD_ARTICLE_LIST',
  };
}
