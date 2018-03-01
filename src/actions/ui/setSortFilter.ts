export interface SetSortFilter {
  type: 'SET_SORT_FILTER';
  filter: string;
}
export default function setSortFilter(
  filter: string,
): SetSortFilter {
  return {
    type: 'SET_SORT_FILTER',
    filter
  };
}
