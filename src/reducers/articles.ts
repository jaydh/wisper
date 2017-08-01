import { AddArticleFulfilled } from '../actions/addArticle';
import { DeleteArticleFulfilled } from '../actions/deleteArticle';
import { ToggleArticleReadFulfilled } from '../actions/toggleArticleRead';
import { AddArticleToProjectFulfilled } from '../actions/addArticleToProject';
import { SyncArticlesFulfilled } from '../actions/syncArticles';
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
    return articleState.filter(article => article.id !== action.articleHash);
}

function updateArticle(articleState: articleType[], action: any) {
    return articleState.map(article => {
        return article.id === action.article.id
            ?
            action.article : article;
    });
}

function addArticleFromServer(articleState: articleType[], action: any) {
    return articleState.concat(action.article);
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

function syncArticles(articleState: articleType[], action: SyncArticlesFulfilled) {
    if (action.articles !== null) {
        const fetchedArticles = action.articles;
        const fetchedArticleIDs = Object.keys(fetchedArticles);
        const localIDs = articleState.map(article => article.id);

        const newArticles: articleType[] = [];
        fetchedArticleIDs.forEach(id => {
            // check article hashes to see if different
            if (localIDs.indexOf(id) < 0) {
                newArticles.push(fetchedArticles[id]);
            }
        });
        console.log('new', newArticles);

        // Add way to mutate articles based on time stamps

        // Filters articles that were deleted from firebase and then concatenates new ones
        return (articleState.filter(article =>
            fetchedArticleIDs.indexOf(article.id) > -1).
            concat(newArticles)
        );
    }
    return [];
}

const articles = createReducer([], {
    'ADD_ARTICLE_FULFILLED': addArticle,
    'DELETE_ARTICLE_FULFILLED': deleteArticle,
    'TOGGLE_ARTICLE_READ': toggleArticleRead,
    'ADD_ARTICLE_TO_PROJECT': addArticleToProject,
    'SYNC_ARTICLES_FULFILLED': syncArticles,
    'UPDATE_ARTICLE': updateArticle,
    'ADD_ARTICLE_FROM_SERVER': addArticleFromServer
});

export default articles;