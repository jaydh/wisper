import * as constants from '../constants/actionTypes';
import database from '../database';
import { Dispatch } from 'react-redux';

const user = 'jay';

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
export type AddArticleToProjectActions = AddArticleToProjectFulfilled | AddArticleToProjectRejected | AddArticleToProjectRequested;

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

function AddArticleToProjectFulfilled(articleHash: string, project: string): AddArticleToProjectFulfilled {
    return {
        type: constants.ADD_ARTICLE_TO_PROJECT_FULFILLED,
        articleHash: articleHash,
        project: project
    };
}

export function addArticleToProject(articleHash: string, project: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(AddArticleToProjectRequested());

        console.log('container', articleHash);
        const articleRef = database.ref('/' + user + '/' + 'articles/' + articleHash + '/projects');
        const projectRef = articleRef.push();

        articleRef.once('value', function (snapshot: any) {
            projectRef
                .set({
                    projectId: project
                })
                .then(() => {
                    dispatch(AddArticleToProjectFulfilled(articleHash, project));
                })
                .catch((error: string) => {
                    console.log(error);
                    dispatch(AddArticleToProjectRejected());
                });

        });
    }
}
