import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS } from 'immutable';

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
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(AddArticleToProjectRequested());

    const projectRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + articleID + '/projects'
    );
    const projects = database.ref('/userData/' + user + '/projects/');

    projectRef
      .once('value', function (snapshot: any) {
        projectRef
          .push(project)
          .then(() => {
            dispatch(AddArticleToProjectFulfilled(articleID, project));
          })
          .catch((error: string) => {
            console.log(error);
            dispatch(AddArticleToProjectRejected());
          });
      })
      .then(() => {
        projects.once('value').then(function (snapshot: any) {
          const push = () =>
            projects.push({
              id: project
            });
          if (snapshot.val()) {
            const proj = fromJS(snapshot.val())
              .valueSeq()
              .map((t: Map<string, any>) => t.get('id'));
            if (!proj.includes(project)) {
              push();
            }
          } else {
            push();
          }
        });
      });
  };
}
