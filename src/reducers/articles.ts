import { AddArticleFulfilled } from '../actions/addArticle';
import { DeleteArticleFulfilled } from '../actions/deleteArticle';
import { ToggleArticleReadFulfilled } from '../actions/toggleArticleRead';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import { Article as articleType } from '../constants/StoreState';
import createReducer from './createReducer';

const now = new Date();

function addArticle(articleState: articleType[], action: AddArticleFulfilled) {
    let check = articleState.filter(article => {
        return action.articleHash === article.id;
    });
    if (check.length > 0) {
        console.log('article in store already');
        return articleState;
    }

    return articleState.concat({
        id: action.articleHash,
        link: action.articleLink,
        dateAdded: now.toLocaleDateString(),
        completed: false
    });
}

function deleteArticle(articleState: articleType[], action: DeleteArticleFulfilled) {
    console.log(action);
    return articleState.filter(article => article.id !== action.id);
}

function updateArticle(articleState: articleType[], action: any) {
    return articleState.map(article => {
        return article.id === action.article.id
            ?
            action.article : article;
    });
}

function addArticleFromServer(articleState: articleType[], action: any) {
    let check = articleState.filter(article => {
        return action.article.id === article.id;
    });
    if (check.length > 0) {
        return articleState;
    }
    return check ? articleState.concat(action.article) : articleState;
}

function deleteArticleFromServer(articleState: articleType[], action: any) {
        return articleState.filter(article => article.id !== action.article.id);
}

function addArticleToProject(articleState: articleType[], action: AddArticleToProjectFulfilled) {

    return articleState.map(article => {
        return article.id === action.articleHash
            ? {
                ...article,
                project: action.project
            }
            : article;
    });
}

function toggleArticleRead(articleState: articleType[], action: ToggleArticleReadFulfilled) {
    return articleState.map(article => {
        // Only update dateRead if hasn't been read before
        const newDateRead = !article.completed
            ? now.toLocaleDateString()
            : article.dateRead;
        return article.id === action.articleHash
            ? {
                ...article,
                completed: !article.completed,
                dateRead: newDateRead,
                lastViewed: now
            }
            : article;
    });
}

const articles = createReducer([], {
    'ADD_ARTICLE_FULFILLED': addArticle,
    'DELETE_ARTICLE_FULFILLED': deleteArticle,
    'TOGGLE_ARTICLE_READ': toggleArticleRead,
    'ADD_ARTICLE_TO_PROJECT': addArticleToProject,
    'UPDATE_ARTICLE': updateArticle,
    'ADD_ARTICLE_FROM_SERVER': addArticleFromServer,
    'DELETE_ARTICLE_FROM_SERVER': deleteArticleFromServer
});

export default articles;