import * as constants from '../constants/actionTypes';
import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';
import { List, fromJS } from 'immutable';

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
    const projects = database.ref('/userData/' + user + '/projects/');

    projectRef.once('value', function(snapshot: any) {
      projectRef
        .push(project)
        .then(() => {
          dispatch(AddArticleToProjectFulfilled(articleHash, project));
        })
        .catch((error: string) => {
          console.log(error);
          dispatch(AddArticleToProjectRejected());
        });
    });

    fetch(
      'http://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/' +
        project +
        '/json'
    )
      .then(function(response: any) {
        return response.json();
      })
      .then(function(json: any) {
        let dictionary: List<string> = fromJS([]);
        const synonymGroups = fromJS(json).toList();
        synonymGroups.forEach((t: any) => {
          dictionary = dictionary.merge(t.get('syn'));
        });
        return dictionary;
      })
      .then(function(dictionary: any) {
        projects.once('value').then(function(snapshot: any) {
          if (!snapshot.hasChild(project)) {
            projects.push({ id: project, dictionary: dictionary.toJS() });
          }
        });
      });
  };
}
