import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
const now = new Date();

export interface ToggleArticleReadRequested {
  type: 'TOGGLE_ARTICLE_READ_REQUESTED';
}
export interface ToggleArticleReadFulfilled {
  type: 'TOGGLE_ARTICLE_READ_FULFILLED';
  articleHash: string;
  update: { completed: boolean; dateRead: string };
}
export interface ToggleArticleReadRejected {
  type: 'TOGGLE_ARTICLE_READ_REJECTED';
}

function ToggleArticleReadRequested(): ToggleArticleReadRequested {
  return {
    type: 'TOGGLE_ARTICLE_READ_REQUESTED'
  };
}

function ToggleArticleReadRejected(): ToggleArticleReadRejected {
  return {
    type: 'TOGGLE_ARTICLE_READ_REJECTED'
  };
}

function ToggleArticleReadFulfilled(
  articleHash: string,
  update: { completed: boolean; dateRead: string }
): ToggleArticleReadFulfilled {
  return {
    type: 'TOGGLE_ARTICLE_READ_FULFILLED',
    articleHash: articleHash,
    update: update
  };
}

export function toggleArticleRead(articleHash: string) {
  const user = auth().currentUser.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(ToggleArticleReadRequested());

    const articleRef = database.ref(
      '/userData/' + user + '/' + 'articles/' + articleHash
    );
    // Check if article in database
    articleRef.once('value', function (snapshot: any) {
      if (!snapshot.exists()) {
        alert('Article does not exist in database');
      } else {
        const completed = snapshot.val().completed;
        const newDateRead = !completed
          ? now.toLocaleString()
          : snapshot.val().dateRead as string;
        const update = {
          dateRead: newDateRead,
          completed: !completed
        };
        articleRef
          .update(update)
          .then(() => {
            dispatch(ToggleArticleReadFulfilled(articleHash, update));
          })
          .catch((error: string) => {
            console.log(error);
            dispatch(ToggleArticleReadRejected());
          });
      }
    });
  };
}
