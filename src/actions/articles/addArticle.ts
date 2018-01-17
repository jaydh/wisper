import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import AddArticleToProject from './addArticleToProject';
import * as moment from 'moment';
let Hashes = require('jshashes');
var SHA1 = new Hashes.SHA1();

export interface AddArticleRequested {
  type: 'ADD_ARTICLE_REQUESTED';
}
export interface AddArticleFulfilled {
  type: 'ADD_ARTICLE_FULFILLED';
  articleLink: string;
  articleHash: string;
  project?: string;
}
export interface AddArticleRejected {
  type: 'ADD_ARTICLE_REJECTED';
}

export interface AddArticle {
  type: 'ADD_ARTICLE';
  articleLink: string;
  project?: string;
}

function AddArticleRequested(): AddArticleRequested {
  return {
    type: 'ADD_ARTICLE_REQUESTED'
  };
}

function AddArticleRejected(): AddArticleRejected {
  return {
    type: 'ADD_ARTICLE_REJECTED'
  };
}

function AddArticleFulfilled(
  articleLink: string,
  project?: string
): AddArticleFulfilled {
  return {
    type: 'ADD_ARTICLE_FULFILLED',
    articleLink: articleLink,
    articleHash: SHA1.hex(articleLink),
    project: project
  };
}

export default function addArticle(articleLink: string, project?: string) {
  const user = auth().currentUser.uid;
  const now = moment();

  return async (dispatch: Dispatch<any>) => {
    dispatch(AddArticleRequested());

    const hash = SHA1.hex(articleLink);
    const articleRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + hash
    );

    return articleRef.once('value').then(function(snapshot: any) {
      // Check if article in database
      snapshot.exists()
        ? dispatch(AddArticleRejected)
        : articleRef
            .set({
              link: articleLink,
              id: hash,
              dateAdded: now.toLocaleString(),
              completed: false,
              fetching: true
            })
            .then(() => {
              dispatch(AddArticleFulfilled(articleLink));
            })
            .then(() => {
              if (project) {
                dispatch(AddArticleToProject(hash, project));
              }
            })
            .catch((error: string) => {
              console.log(error);
              dispatch(AddArticleRejected());
            });
    });
  };
}
