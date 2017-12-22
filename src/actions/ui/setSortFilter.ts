export interface SetSortFilter {
  type: 'SET_SORT_FILTER';
  filter: string;
  id: string;
}
export default function setSortFilter(
  filter: string,
  id: string
): SetSortFilter {
  return {
    type: 'SET_SORT_FILTER',
    filter,
    id
  };
}
