import * as constants from '../constants/actionTypes';

export interface SetVisbilityFilter {
  type: constants.SET_VISIBILITY_FILTER;
  filter: string;
  id: string;
}
export function setVisibilityFilter(filter: string, id: string) {
  return {
    type: constants.SET_VISIBILITY_FILTER,
    id,
    filter
  };
}
