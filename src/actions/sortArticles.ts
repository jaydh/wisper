import * as constants from '../constants/actionTypes';

export interface SortArticles {
  type: constants.SORT_ARTICLES;
  filter: string;
}
export function sortArticles(filter: string) {
  return {
    type: constants.SORT_ARTICLES,
    filter
  };
}
