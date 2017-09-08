import createReducer from './createReducer';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import {
  AddArticleFromServer,
  UpdateProject,
  AddProject,
  DeleteProject,
  UpdateArticle
} from '../actions/syncWithFirebase';
import { Set, fromJS, Map } from 'immutable';
import { Article as articleType } from '../constants/StoreState';

// Project wordbanks only contain unique identifiers
// only do this afte projects are pulled. turn this into an action
// Small bug where the set doing the subtracting keeps the common word
/*function makeProjectsUnique(
  projectState: Map<string, Set<string>>
): Map<string, Set<string>> {
  let newProjectState = projectState;
  newProjectState.keySeq().forEach((t: string) => {
    const others = newProjectState.delete(t).valueSeq();
    const unique = newProjectState.get(t).subtract(...others.toJS());
    newProjectState = newProjectState.set(t, unique);
  });
  return newProjectState;
}*/

function projectWordBank(
  projectState: Map<string, Set<string>>,
  projects: Set<string>,
  article: articleType
): Map<string, Set<string>> {
  
  // Adds words in description to word bank
  let newProjectState = projectState;
  projects.forEach((project: string) => {
    let newWords: Set<string> = Set();
    if (projectState.has(project) && article.metadata) {
     
      newWords = newWords
        .union(projectState.get(project), newWords)
        .map((t: string) => t.toLowerCase())
        .toSet();
      newProjectState = newProjectState.set(project, newWords);
    }
  });
  return newProjectState;
}
function addArticleToProject(
  projectState: Map<string, Set<string>>,
  action: AddArticleToProjectFulfilled
): Map<string, Set<string>> {
  return projectWordBank(projectState, Set([action.project]), action.article);
}

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

function updateArticle(
  projectState: Map<string, Set<string>>,
  action: UpdateArticle
) {
  if (action.article.projects) {
    const projects = fromJS(action.article.projects)
      .valueSeq()
      .toSet();
    return projectWordBank(projectState, projects, action.article);
  }
  return projectState;
}

function addArticleFromServer(
  projectState: Map<string, Set<string>>,
  action: AddArticleFromServer
): Map<string, Set<string>> {
  const projects = action.article.projects
    ? fromJS(action.article.projects)
        .valueSeq()
        .toSet()
    : Set(['']);
  return projectWordBank(projectState, projects, action.article);
}

const projectReducer = createReducer(Map<string, Set<string>>(), {
  ADD_ARTICLE_TO_PROJECT_FULFILLED: addArticleToProject,
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT: addProject,
  DELETE_PROJECT: deleteProject,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer
});

export default projectReducer;
