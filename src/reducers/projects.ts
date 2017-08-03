import createReducer from './createReducer';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import { List } from 'immutable';

function addArticleToProject(
  projectState: List<string>,
  action: AddArticleToProjectFulfilled
) {
  return projectState.includes(action.project)
    ? projectState
    : projectState.push(action.project);
}

const visibilityReducer = createReducer(List([]), {
  ADD_ARTICLE_TO_PROJECT_FULFILLED: addArticleToProject
});

export default visibilityReducer;
