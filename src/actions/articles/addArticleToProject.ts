import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS, List } from 'immutable';

export interface AddArticleToProjectRequested {
  type: 'ADD_ARTICLE_TO_PROJECT_REQUESTED';
}
export interface AddArticleToProjectFulfilled {
  type: 'ADD_ARTICLE_TO_PROJECT_FULFILLED';
  article: string;
  project: string;
}
export interface AddArticleToProjectRejected {
  type: 'ADD_ARTICLE_TO_PROJECT_REJECTED';
}

function AddArticleToProjectRequested(): AddArticleToProjectRequested {
  return {
    type: 'ADD_ARTICLE_TO_PROJECT_REQUESTED'
  };
}

function AddArticleToProjectRejected(): AddArticleToProjectRejected {
  return {
    type: 'ADD_ARTICLE_TO_PROJECT_REJECTED'
  };
}

function AddArticleToProjectFulfilled(
  article: string,
  project: string
): AddArticleToProjectFulfilled {
  return {
    type: 'ADD_ARTICLE_TO_PROJECT_FULFILLED',
    article,
    project
  };
}
export default function addArticleToProject(
  articleID: string,
  project: string
) {
  const user = auth()!.currentUser!.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(AddArticleToProjectRequested());

    const projectRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + articleID + '/projects'
    );
    const projects = database.ref('/userData/' + user + '/projects/');

    return Promise.all([
      projectRef.push(project).then(() => {
        dispatch(AddArticleToProjectFulfilled(articleID, project));
      }),
      projects.once('value').then(function(snapshot: any) {
        const articleProjects = snapshot.val()
          ? fromJS(snapshot.val())
              .valueSeq()
              .map((t: Map<string, any>) => t.get('id'))
          : List<string>();
        if (articleProjects.isEmpty() || !articleProjects.includes(project)) {
          projects.push({
            id: project,
            finalized: false
          });
        }
      })
    ]);
  };
}
