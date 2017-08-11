import createReducer from './createReducer';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import { AddArticleFromServer } from '../actions/syncArticles';
import { List } from 'immutable';

function addArticleToProject(
  projectState: List<String>,
  action: AddArticleToProjectFulfilled
) {
  return projectState.includes(action.project)
    ? projectState
    : projectState.push(action.project.toLocaleLowerCase());
}

function addArticleFromServer(
  projectState: List<String>,
  action: AddArticleFromServer
) {
  if (action.article) {
    const projects = action.article.projects;
    if (projects) {
      const projectIDs = Object.keys(projects).map(key => projects[key].toLocaleLowerCase());
      const newProjectIDs = projectIDs.filter(key => !projectState.contains(key));
      return projectState.concat(newProjectIDs);
    }
  }
  return projectState;
}

const projectReducer = createReducer(List([]), {
  ADD_ARTICLE_TO_PROJECT_FULFILLED: addArticleToProject,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer
});

export default projectReducer;
