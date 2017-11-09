import * as constants from '../../constants/actionTypes';
import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import AddArticleToProject from './addArticleToProject';
import * as moment from 'moment';
let Hashes = require('jshashes');
var SHA1 = new Hashes.SHA1();

export interface AddArticleRequested {
  type: constants.ADD_ARTICLE_REQUESTED;
}
export interface AddArticleFulfilled {
  type: constants.ADD_ARTICLE_FULFILLED;
  articleLink: string;
  articleHash: string;
  project?: string;
}
export interface AddArticleRejected {
  type: constants.ADD_ARTICLE_REJECTED;
}

export interface AddArticle {
  type: 'ADD_ARTICLE';
  articleLink: string;
  project?: string;
}

function AddArticleRequested(): AddArticleRequested {
  return {
    type: constants.ADD_ARTICLE_REQUESTED
  };
}

function AddArticleRejected(): AddArticleRejected {
  return {
    type: constants.ADD_ARTICLE_REJECTED
  };
}

function AddArticleFulfilled(
  articleLink: string,
  project?: string
): AddArticleFulfilled {
  return {
    type: constants.ADD_ARTICLE_FULFILLED,
    articleLink: articleLink,
    articleHash: SHA1.hex(articleLink),
    project: project
  };
}

export default function addArticle(articleLink: string, project?: string) {
  const user = auth().currentUser.uid;
  const now = moment();

  return (dispatch: Dispatch<any>) => {
    dispatch(AddArticleRequested());

    const hash = SHA1.hex(articleLink);
    const articleRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + hash
    );
    /* If on a ArticleList has project filter, assuming intention is to add article with project of list. 
    Updating null value for firebase does nothing.*/
    let projectPushKey = articleRef.child('projects').push().key;
    let projectWithKey = {};
    projectWithKey[projectPushKey] = project ? project : null;

    return articleRef.once('value').then(function(snapshot: any) {
      // Check if article in database
      if (snapshot.exists()) {
        dispatch(AddArticleRejected());
      } else {
        articleRef
          .set({
            link: articleLink,
            id: hash,
            dateAdded: now.toLocaleString(),
            completed: false,
            fetching: true
          })
          .then(articleRef.child('projects').update(projectWithKey))
          .then(() => {
            dispatch(AddArticleFulfilled(articleLink, project));
          })
          .then(() => {
            if (project) {
              dispatch(AddArticleToProject(articleLink, project));
            }
          })
          .catch((error: string) => {
            console.log(error);
            dispatch(AddArticleRejected());
          });
      }
    });
  };
}
