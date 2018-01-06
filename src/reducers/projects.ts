import createReducer from './createReducer';
import {
  UpdateProject,
  AddProject,
  DeleteProject
} from '../actions/syncWithFirebase';
import { List } from 'immutable';
import { Project } from '../constants/StoreState';

function addProject(projectState: List<Project>, action: AddProject) {
  const entry = projectState.find((t: Project) => t.id === action.project.id);
  return entry
    ? projectState.set(entry[0], action.project)
    : projectState.push(action.project);
}

function deleteProject(projectState: List<Project>, action: DeleteProject) {
  return projectState.filter((t: Project) => t.id !== action.project.id);
}

function updateProject(projectState: List<Project>, action: UpdateProject) {
  return projectState.map(
    (t: Project) => (t.id === action.project.id ? action.project : t)
  );
}

const projectReducer = createReducer(List(), {
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT: addProject,
  DELETE_PROJECT: deleteProject
});

export default projectReducer;
