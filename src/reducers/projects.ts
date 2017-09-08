import createReducer from './createReducer';
import {
  UpdateProject,
  AddProject,
  DeleteProject,
} from '../actions/syncWithFirebase';
import { Set, Map } from 'immutable';

function addProject(
  projectState: Map<string, Set<string>>,
  action: AddProject
) {
  return projectState.update(action.project.id, (t = Set([])) =>
    t.union(action.project.dictionary)
  );
}

function deleteProject(
  projectState: Map<string, Set<string>>,
  action: DeleteProject
) {
  return projectState.delete(action.project.id);
}

function updateProject(
  projectState: Map<string, Set<string>>,
  action: UpdateProject
) {
  return projectState.mapKeys((project: string) => {
    return project === action.project.id
      ? action.project
      : projectState.get(project);
  });
}

const projectReducer = createReducer(Map<string, Set<string>>(), {
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT: addProject,
  DELETE_PROJECT: deleteProject,
});

export default projectReducer;
