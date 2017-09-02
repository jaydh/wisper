import createReducer from './createReducer';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import { AddArticleFromServer } from '../actions/syncWithFirebase';
import { Set, fromJS, Map } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
function projectWordBank(
  projectState: Map<String, Set<string>>,
  projects: Set<string>,
  article: articleType
): Map<String, Set<string>> {
  const visibleMeta = fromJS([
    'ogTitle',
    'title',
    'ogSiteName',
    'ogDescription',
    'description'
  ]);
 
  // Adds words in description to word bank
  let newProjectState = projectState;
  projects.forEach((project: string) => {
    let newWords: Set<string> = Set();
    if (projectState.has(project) && article.metadata) {
      const meta = fromJS(article.metadata);
      meta
        .keySeq()
        .filter((t: string) => visibleMeta.includes(t))
        .forEach(
          (t: string) =>
            (newWords = newWords.union(Set(meta.get(t).split(' '))))
        );
      newWords = newWords.union(projectState.get(project), newWords);
      newProjectState = newProjectState.set(project, newWords);
    }
  });
  return newProjectState;
}
function addArticleToProject(
  projectState: Map<String, Set<string>>,
  action: AddArticleToProjectFulfilled
): Map<String, Set<string>> {
  return projectWordBank(projectState, Set([action.project]), action.article);
}

function addProject(projectState: Map<String, Set<string>>, action: any) {
  return projectState.update(action.project.id, (t = Set([])) =>
    t.union(action.project.dictionary)
  );
}

function deleteProject(projectState: Map<String, Set<string>>, action: any) {
  return projectState.delete(action.project.id);
}

function updateProject(projectState: Map<String, Set<string>>, action: any) {
  return projectState.mapKeys((project: string) => {
    return project === action.project.id
      ? action.project
      : projectState.get(project);
  });
}

function updateArticle(projectState: Map<String, Set<string>>, action: any) {
  if (action.article.projects) {
    const projects = fromJS(action.article.projects)
      .valueSeq()
      .toSet();
    return projectWordBank(projectState, projects, action.article);
  }
  return projectState;
}

function addArticleFromServer(
  projectState: Map<String, Set<string>>,
  action: AddArticleFromServer
): Map<String, Set<string>> {
  const projects = action.article.projects
    ? fromJS(action.article.projects)
        .valueSeq()
        .toSet()
    : Set(['']);
  return projectWordBank(
    projectState,
    projects,
    action.article
  );
}

const projectReducer = createReducer(Map<String, Set<String>>(), {
  ADD_ARTICLE_TO_PROJECT_FULFILLED: addArticleToProject,
  UPDATE_PROJECT: updateProject,
  ADD_PROJECT: addProject,
  DELETE_PROJECT: deleteProject,
  UPDATE_ARTICLE: updateArticle,
  ADD_ARTICLE_FROM_SERVER: addArticleFromServer
});

export default projectReducer;
