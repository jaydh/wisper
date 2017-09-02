import createReducer from './createReducer';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
// import { AddArticleFromServer } from '../actions/syncArticles';
import { Map, List } from 'immutable';

function addArticleToProject(
  projectState: Map<String, List<string>>,
  action: AddArticleToProjectFulfilled
): Map<String, List<string>> {
  return projectState.has(action.project)
    ? projectState
    : projectState.set(action.project, List([]));
}

function addProject(projectState: Map<String, List<string>>, action: any) {
  return projectState.set(action.project.id, action.project.dictionary);
}

function updateProject(projectState: Map<String, List<string>>, action: any) {
  return projectState.mapKeys((project: string) => {
    return project === action.project.id
      ? action.project
      : projectState.get(project);
  });
}

/*
function addArticleFromServer(
  projectState: Map<String, Meta>,
  action: AddArticleFromServer
): Map<String, Meta> {
  const projects = fromJS(action.article.projects);
  console.log('pstate', projectState);
  if (projects) {
    let newProjectState = projectState;
    const projectIDs = projects.valueSeq();
    projectIDs
      .filter((key: string) => !projectState.has(key))
      .forEach((project: string) => {
        newProjectState = newProjectState.set(project, action.meta);
      });
    console.log(newProjectState.toJS());
    return newProjectState;
  }

  return projectState;
}*/

const projectReducer = createReducer(Map<String, List<String>>(), {
  ADD_ARTICLE_TO_PROJECT_FULFILLED: addArticleToProject,
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT: addProject
  // ADD_ARTICLE_FROM_SERVER: addArticleFromServer
});

export default projectReducer;
