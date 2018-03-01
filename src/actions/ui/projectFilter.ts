export interface SetProjectFilter {
  type: 'SET_PROJECT_FILTER';
  filter: string;
}
export function setProjectFilter(filter: string): SetProjectFilter {
  return {
    type: 'SET_PROJECT_FILTER',
    filter: filter
  };
}

export interface DeleteProjectFilter {
  type: 'DELETE_PROJECT_FILTER';
  filter: string;
}
export function deleteProjectFilter(filter: string): DeleteProjectFilter {
  return {
    type: 'DELETE_PROJECT_FILTER',
    filter: filter
  };
}
