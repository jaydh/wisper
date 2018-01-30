import { SetUIView } from '../actions/ui/setUIView';
import { SetCurrentArticle } from '../actions/ui/setCurrentArticle';
import createReducer from './createReducer';
import { Article } from '../constants/StoreState';

interface UIState {
  view: string;
  fetchingArticles: boolean;
  fetchingDailies: boolean;
  demoStart: boolean;
  demoComplete: boolean;
  dailyGraphMin: Date;
  dailyGraphMax: Date;
  currentArticle: Article;
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

function setDailyGraphSpan(uiState: UIState, action: any): UIState {
  return { ...uiState, dailyGraphMin: action.min, dailyGraphMax: action.max };
}

function setCurrentArticle(
  uiState: UIState,
  action: SetCurrentArticle
): UIState {
  return { ...uiState, currentArticle: action.article };
}

export default createReducer(
  {
    view: 'compact',
    fetchingArticles: false,
    fetchingDailies: false,
    demoComplete: null,
    demoStart: null,
    dailyGraphMin: new Date(),
    dailyGraphMax: new Date()
  },
  {
    SET_UI_VIEW: setUIView,
    FETCHING_ARTICLES_REQUESTED: fetchingArticlesRequested,
    FETCHING_ARTICLES_COMPLETED: fetchingArticlesCompleted,
    FETCHING_DAILIES_REQUESTED: fetchingDailiesRequested,
    FETCHING_DAILIES_COMPLETED: fetchingDailiesCompleted,
    DEMO_START: demoStart,
    DEMO_COMPLETE: demoComplete,
    SET_DAILY_GRAPH_SPAN: setDailyGraphSpan,
    SET_CURRENT_ARTICLE: setCurrentArticle
  }
);
