import * as constants from '../constants/actionTypes';

export interface SetProjectFilter {
  type: constants.SET_PROJECT_FILTER;
  filter: string;
  id: string;
}
export function setProjectFilter(filter: string, id: string): SetProjectFilter {
  return {
    type: constants.SET_PROJECT_FILTER,
    filter,
    id
  };
}
