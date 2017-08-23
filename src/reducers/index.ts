import articles from './articles';
import projects from './projects';
import articleLists from './articleLists';
let { combineReducers } = require('redux-immutable');

const appReducer = combineReducers({
  articles,
  projects,
  articleLists
});

export default appReducer;
