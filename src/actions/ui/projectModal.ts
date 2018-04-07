export interface SetProjectModalBinding {
  type: 'SET_PROJECT_MODAL_BINDING';
  id: string;
}

export default (id: string): SetProjectModalBinding => {
  return {
    type: 'SET_PROJECT_MODAL_BINDING',
    id
  };
};
