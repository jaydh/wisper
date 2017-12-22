export interface SetVisbilityFilter {
  type: 'SET_VISIBILITY_FILTER';
  filter: string;
  id: string;
}
export function setVisibilityFilter(filter: string, id: string) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    id,
    filter
  };
}
