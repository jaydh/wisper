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

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT' || action.type === 'DELETE_USER_DATA') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
