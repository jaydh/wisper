import articles from './articles';
import projects from './projects';
import articleLists from './articleLists';
import dailies from './dailies';
import ui from './ui';
import { combineReducers } from 'redux-immutable';

const appReducer = combineReducers({
  articles,
  projects,
  articleLists,
  dailies,
  ui
});
export default appReducer;
