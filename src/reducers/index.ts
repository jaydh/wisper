import articles from './articles';
import projects from './projects';
import articleLists from './articleLists';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    articles,
    projects,
    articleLists
});

export default appReducer;
