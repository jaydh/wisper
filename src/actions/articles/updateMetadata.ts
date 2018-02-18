export interface UpdateMetadata {
  type: 'UPDATE_METADATA';
  id: string;
  key: string;
  value: any;
}

export default function updateMetadata(id: string, key: string, value: string) {
  return {
    type: 'UPDATE_METADATA',
    id,
    key,
    value
  };
}
