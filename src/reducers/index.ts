import articles from './articles';
import visibilityFilter from './visibilityFilter';
import projects from './projects';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    articles,
    visibilityFilter,
    projects
});

export default appReducer;
