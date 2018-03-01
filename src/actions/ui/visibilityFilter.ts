export interface SetVisbilityFilter {
  type: 'SET_VISIBILITY_FILTER';
  filter: string;
}
export function setVisibilityFilter(filter: string) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
}
