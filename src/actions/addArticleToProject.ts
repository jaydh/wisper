import * as constants from '../constants/actionTypes';
import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';

export interface AddArticleToProjectRequested {
  type: constants.ADD_ARTICLE_TO_PROJECT_REQUESTED;
}
export interface AddArticleToProjectFulfilled {
  type: constants.ADD_ARTICLE_TO_PROJECT_FULFILLED;
  articleHash: string;
  project: string;
}
export interface AddArticleToProjectRejected {
  type: constants.ADD_ARTICLE_TO_PROJECT_REJECTED;
}

function AddArticleToProjectRequested(): AddArticleToProjectRequested {
  return {
    type: constants.ADD_ARTICLE_TO_PROJECT_REQUESTED
  };
}

function AddArticleToProjectRejected(): AddArticleToProjectRejected {
  return {
    type: constants.ADD_ARTICLE_TO_PROJECT_REJECTED
  };
}

function AddArticleToProjectFulfilled(
  articleHash: string,
  project: string
): AddArticleToProjectFulfilled {
  return {
    type: constants.ADD_ARTICLE_TO_PROJECT_FULFILLED,
    articleHash: articleHash,
    project: project
  };
}

export function addArticleToProject(articleHash: string, project: string) {
  const user = auth().currentUser.uid;

  return (dispatch: Dispatch<any>) => {
    dispatch(AddArticleToProjectRequested());

    const projectRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + articleHash + '/projects'
    );

    projectRef.once('value', function(snapshot: any) {
      projectRef
        .push(project)
        .then(() => {
          dispatch(
            AddArticleToProjectFulfilled(
              articleHash,
              project
            )
          );
        })
        .catch((error: string) => {
          console.log(error);
          dispatch(AddArticleToProjectRejected());
        });
    });
  };
}
