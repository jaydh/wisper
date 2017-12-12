import { SetUIView } from '../actions/setUIView';
import createReducer from './createReducer';

interface UIState {
  view: string;
  fetchingArticles: boolean;
  fetchingDailies: boolean;
  demoStart: boolean;
  demoComplete: boolean;
}

function setUIView(uiState: UIState, action: SetUIView): UIState {
  return { ...uiState, view: action.view };
}

function fetchingArticlesRequested(uiState: UIState, action: any): UIState {
  return { ...uiState, fetchingArticles: true };
}
function fetchingArticlesCompleted(uiState: UIState, action: any): UIState {
  return { ...uiState, fetchingArticles: false };
}
function fetchingDailiesRequested(uiState: UIState, action: any): UIState {
  return { ...uiState, fetchingDailies: true };
}
function fetchingDailiesCompleted(uiState: UIState, action: any): UIState {
  return { ...uiState, fetchingDailies: false };
}
function demoStart(uiState: UIState, action: any): UIState {
  return { ...uiState, demoStart: true, demoComplete: false };
}
function demoComplete(uiState: UIState, action: any): UIState {
  return { ...uiState, demoComplete: true };
}
export default createReducer(
  {
    view: 'Full',
    fetchingArticles: false,
    fetchingDailies: false,
    demoComplete: null,
    demoStart: null
  },
  {
    SET_UI_VIEW: setUIView,
    FETCHING_ARTICLES_REQUESTED: fetchingArticlesRequested,
    FETCHING_ARTICLES_COMPLETED: fetchingArticlesCompleted,
    FETCHING_DAILIES_REQUESTED: fetchingDailiesRequested,
    FETCHING_DAILIES_COMPLETED: fetchingDailiesCompleted,
    DEMO_START: demoStart,
    DEMO_COMPLETE: demoComplete
  }
);
