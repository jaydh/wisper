import articles from './articles';
import projects from './projects';
import articleLists from './articleLists';
import dailies from './dailies';
let { combineReducers } = require('redux-immutable');

const appReducer = combineReducers({
  articles,
  projects,
  articleLists,
  dailies
});

export default appReducer;
