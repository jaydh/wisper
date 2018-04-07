import createReducer from './createReducer';
import {
  UpdateProject,
  AddProject,
  DeleteProject,
  AddProjectFromServer
} from '../actions/syncWithFirebase';
import { List, fromJS } from 'immutable';
import { Project } from '../constants/StoreState';

function processProject(project: Project) {
  for (const x in project) {
    if (!Object.hasOwnProperty(x)) {
      project[x] = fromJS(project[x]);
    }
  }
  project.dictionary = project.dictionary ? project.dictionary : List();
  return project;
}

function addProject(projectState: List<Project>, action: AddProject) {
  const entry = projectState.find((t: Project) => t.id === action.id);
  return entry
    ? projectState
    : projectState.push(
        processProject({
          id: action.id,
          finalized: false,
          dictionary: List<string>()
        })
      );
}

function addProjectFromServer(
  projectState: List<Project>,
  action: AddProjectFromServer
) {
  const entry = projectState.find((t: Project) => t.id === action.project.id);
  return entry
    ? projectState.set(entry[0], processProject(action.project))
    : projectState.push(processProject(action.project));
}

function deleteProject(projectState: List<Project>, action: DeleteProject) {
  return projectState.filter((t: Project) => t.id !== action.project.id);
}

function updateProject(projectState: List<Project>, action: UpdateProject) {
  return projectState.map(
    (t: Project) =>
      t.id === action.project.id ? processProject(action.project) : t
  );
}

const projectReducer = createReducer(List<Project>(), {
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT_FROM_SERVER: addProjectFromServer,
  ADD_PROJECT: addProject,
  DELETE_PROJECT: deleteProject
});

export default projectReducer;
