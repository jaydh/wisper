export interface UpdateMetadata {
  type: 'UPDATE_METADATA';
  id: string;
  value: any;
}

export default function updateMetadata(id: string, value: string) {
  return {
    type: 'UPDATE_METADATA',
    id,
    value
  };
}
