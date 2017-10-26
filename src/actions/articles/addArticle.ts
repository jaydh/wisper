import * as constants from '../../constants/actionTypes';
import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
// import { fromJS, List } from 'immutable';
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
  const now = new Date();

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

    articleRef.once('value').then(function(snapshot: any) {
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
          .catch((error: string) => {
            console.log(error);
            dispatch(AddArticleRejected());
          });
      }
    });
    /*    if (project) {
      const projects = database.ref('/userData/' + user + '/projects/');

      // Gets dictionary data for project and updates project dicionary accordingly
      fetch(
        'https://words.bighugelabs.com/api/2/b0ccfcccd889eeb6a11c013493465013/' +
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
            const push = () =>
              projects.push({
                id: project,
                dictionary: dictionary.valueSeq().toJS()
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
    }*/
  };
}
