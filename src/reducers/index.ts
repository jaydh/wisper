import articles from './articles';
import visibilityFilter from './visibilityFilter';
import projects from './projects';
import projectFilter from './projectFilter';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    articles,
    visibilityFilter,
    projects,
    projectFilter
});

export default appReducer;
