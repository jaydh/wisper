import articles from './articles';
import visibilityFilter from './visibilityFilter';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    articles,
    visibilityFilter
});

export default appReducer;
