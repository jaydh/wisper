import * as constants from '../constants/actionTypes';

export interface SetProjectFilter {
  type: constants.SET_PROJECT_FILTER;
  filter: string;
  id: string;
}
export function setProjectFilter(filter: string, id: string): SetProjectFilter {
  return {
    type: constants.SET_PROJECT_FILTER,
    filter: filter,
    id: id
  };
}

export interface DeleteProjectFilter {
  type: 'DELETE_PROJECT_FILTER';
  filter: string;
  id: string;
}
export function deleteProjectFilter(filter: string, id: string): DeleteProjectFilter {
  return {
    type: 'DELETE_PROJECT_FILTER',
    filter: filter,
    id: id
  };
}
