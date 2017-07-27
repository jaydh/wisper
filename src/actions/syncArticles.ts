import database from '../database';
import * as constants from '../constants/actionTypes';
import { Dispatch } from 'react-redux';
import { article as articleType } from '../constants/StoreState';

const user = 'jay';

export interface SyncArticlesRequested {
    type: constants.SYNC_ARTICLES_REQUESTED;
}

export interface SyncArticlesFulfilled {
    type: constants.SYNC_ARTICLES_FULFILLED;
    articles: articleType[];
}
export interface SyncArticlesRejected {
    type: constants.SYNC_ARTICLES_REJECTED;
}

function SyncArticlesRequested(): SyncArticlesRequested {
    return {
        type: constants.SYNC_ARTICLES_REQUESTED
    };
}

function SyncArticlesRejected(): SyncArticlesRejected {
    return {
        type: constants.SYNC_ARTICLES_REJECTED
    };
}

function SyncArticlesFulfilled(articles: articleType[]): SyncArticlesFulfilled {
    return {
        type: constants.SYNC_ARTICLES_FULFILLED,
        articles: articles
    };
}

export default function SyncArticles() {
    return (dispatch: Dispatch<any>) => {
        const ref = database.ref('/' + user + '/articles/');
        ref.on('value', function (snap: any) {
            const articles = snap.val();
            dispatch(SyncArticlesFulfilled(articles));
        });
    };
}