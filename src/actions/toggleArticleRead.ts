import * as constants from '../constants/actionTypes';
import database from '../database';
import { Dispatch } from 'react-redux';

const user = 'jay';
const now = new Date();

export interface ToggleArticleReadRequested {
    type: constants.TOGGLE_ARTICLE_READ_REQUESTED;
}
export interface ToggleArticleReadFulfilled {
    type: constants.TOGGLE_ARTICLE_READ_FULFILLED;
    articleHash: string;
}
export interface ToggleArticleReadRejected {
    type: constants.TOGGLE_ARTICLE_READ_REJECTED;
}

function ToggleArticleReadRequested(): ToggleArticleReadRequested {
    return {
        type: constants.TOGGLE_ARTICLE_READ_REQUESTED
    };
}

function ToggleArticleReadRejected(): ToggleArticleReadRejected {
    return {
        type: constants.TOGGLE_ARTICLE_READ_REJECTED
    };
}

function ToggleArticleReadFulfilled(articleHash: string): ToggleArticleReadFulfilled {
    return {
        type: constants.TOGGLE_ARTICLE_READ_FULFILLED,
        articleHash: articleHash
    };
}

export function toggleArticleRead(articleHash: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(ToggleArticleReadRequested());

        const articleRef = database.ref('/' + user + '/' + 'articles/' + articleHash);
        // Check if article in database
        articleRef.once('value', function (snapshot: any) {
            if (!snapshot.exists()) {
                alert('doesnt exist');
            } else {
                const completed = snapshot.val().completed;
                const newDateRead = !completed
                    ? now.toLocaleDateString()
                    : snapshot.val().dateRead;
                articleRef
                    .update({
                        dateRead: newDateRead,
                        completed: !completed
                    })
                    .then(() => {
                        dispatch(ToggleArticleReadFulfilled(articleHash));
                    })
                    .catch((error: string) => {
                        console.log(error);
                        dispatch(ToggleArticleReadRejected());
                    });
            }
        });
    }
}