import * as constants from '../constants/actionTypes';
import database from '../database';
import { Dispatch } from 'react-redux';
let Hashes = require('jshashes');
var SHA1 = new Hashes.SHA1();

export interface DeleteArticleRequested {
    type: constants.DELETE_ARTICLE_REQUESTED;
}
export interface DeleteArticleFulfilled {
    type: constants.DELETE_ARTICLE_FULFILLED;
    articleLink: string;
    articleHash: string;
}
export interface DeleteArticleRejected {
    type: constants.DELETE_ARTICLE_REJECTED;
}
export type DeleteArticleActions = DeleteArticleFulfilled | DeleteArticleRejected | DeleteArticleRequested;

const user = 'jay';

export function deleteArticle(articleHash: string) {

    return (dispatch: Dispatch<any>) => {
        dispatch(deleteArticleRequested());
        const articleRef = database.ref('/' + user + '/' + 'articles/' + articleHash);

        // Check if article in database
        articleRef
            .remove()
            .then(() => {
                dispatch(deleteArticleFulfilled(articleHash));
            })
            .catch((error: string) => {
                console.log(error);
                dispatch(deleteArticleRejected());
            });
    };
}

function deleteArticleRequested(): DeleteArticleRequested {
    return {
        type: constants.DELETE_ARTICLE_REQUESTED
    };
}

function deleteArticleRejected() {
    return {
        type: constants.DELETE_ARTICLE_REJECTED
    };
}

function deleteArticleFulfilled(articleLink: string) {
    return {
        type: constants.DELETE_ARTICLE_FULFILLED,
        articleHash: SHA1.hex(articleLink)
    };
}
