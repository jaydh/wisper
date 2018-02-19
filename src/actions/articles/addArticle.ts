import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import AddArticleToProject from './addArticleToProject';
import updateMetadata from './updateMetadata';
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
  metadata: any;
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
  metadata: any,
  project?: string
): AddArticleFulfilled {
  return {
    type: 'ADD_ARTICLE_FULFILLED',
    articleLink: articleLink,
    articleHash: SHA1.hex(articleLink),
    metadata,
    project: project
  };
}

export default function addArticle(articleLink: string, project?: string) {
  const user = auth().currentUser.uid;
  const now = new Date();

  return async (dispatch: Dispatch<any>) => {
    dispatch(AddArticleRequested());

    const hash = SHA1.hex(articleLink);
    const articleRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + hash
    );
    return articleRef.once('value').then(
      (snapshot: any) =>
        snapshot.exists()
          ? dispatch(AddArticleRejected)
          : articleRef
              .set({
                link: articleLink,
                id: hash,
                dateAdded: now.toLocaleString(),
                completed: false
              })
              .then(() => {
                if (project) {
                  dispatch(AddArticleToProject(hash, project));
                }
                database
                  .ref(`/articleData/${hash}/metadata/`)
                  .on('child_added', (event: any) =>
                    dispatch(updateMetadata(hash, event.key, event.val()))
                  );
              })
              .catch((error: string) => {
                console.log(error);
                dispatch(AddArticleRejected());
              })
    );
  };
}
