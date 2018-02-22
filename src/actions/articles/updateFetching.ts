export interface UpdateFetching {
  type: 'UPDATE_FETCHING';
  id: string;
  fetching: boolean;
}
export default function setFetching(id: string, fetching: boolean) {
  return {
    type: 'UPDATE_FETCHING',
    id,
    fetching
  };
}
