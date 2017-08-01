import * as constants from '../constants/actionTypes';
import { auth, database } from '../firebase';
import { Dispatch } from 'react-redux';
import { ListenToFirebase } from './syncArticles';
let Hashes = require('jshashes');

var SHA1 = new Hashes.SHA1();
const now = new Date();

export interface AddArticleRequested {
  type: constants.ADD_ARTICLE_REQUESTED;
}
export interface AddArticleFulfilled {
  type: constants.ADD_ARTICLE_FULFILLED;
  articleLink: string;
  articleHash: string;
}
export interface AddArticleRejected {
  type: constants.ADD_ARTICLE_REJECTED;
}
export type AddArticleActions =
  | AddArticleFulfilled
  | AddArticleRejected
  | AddArticleRequested;

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

function AddArticleFulfilled(articleLink: string): AddArticleFulfilled {
  return {
    type: constants.ADD_ARTICLE_FULFILLED,
    articleLink: articleLink,
    articleHash: SHA1.hex(articleLink)
  };
}

export function addArticle(articleLink: string) {
  const user = auth().currentUser.uid;

  return (dispatch: Dispatch<any>) => {
    dispatch(AddArticleRequested());

    // Check if valid URL
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (regexp.test(articleLink)) {
      const hash = SHA1.hex(articleLink);
      const articleRef = database.ref(
        '/userData/' + user + '/' + 'articles/' + hash
      );
      // detach listener so current action doesn't trigger server syncing
      articleRef.off();
      articleRef.once('value').then(function(snapshot: any) {
        // Check if article in database
        if (snapshot.exists()) {
          alert('exists');
        } else {
          articleRef
            .set({
              link: articleLink,
              id: hash,
              dateAdded: now.toLocaleDateString(),
              lastViewed: null,
              completed: false
            })
            .then(() => {
              dispatch(AddArticleFulfilled(articleLink));
              dispatch(ListenToFirebase());
            })
            .catch((error: string) => {
              console.log(error);
              dispatch(AddArticleRejected());
            });
        }
      });
    } else {
      dispatch(AddArticleRejected());
      console.log('invalid hyperlink');
    }
  };
}
