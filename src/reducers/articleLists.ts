import { ArticleList } from './../constants/StoreState';
import createReducer from './createReducer';
import {
  SetArticleListSearch,
  SetArticleListView
} from '../actions/ui/articleList';
import { SetVisbilityFilter } from '../actions/ui/visibilityFilter';
import { SetProjectFilter } from '../actions/ui/projectFilter';
import { SetSortFilter } from '../actions/ui/setSortFilter';

function setVisibilityFilter(
  articleListState: ArticleList,
  action: SetVisbilityFilter
) {
  return { ...articleListState, visibilityfilter: action.filter };
}

function setProjectFilter(
  articleListState: ArticleList,
  action: SetProjectFilter
) {
  return { ...articleListState, projectFilter: action.filter };
}

function setSortFilter(articleListState: ArticleList, action: SetSortFilter) {
  return { ...articleListState, sort: action.filter };
}

function setArticleListSearch(
  articleListState: ArticleList,
  action: SetArticleListSearch
) {
  return { ...articleListState, search: action.search };
}

function setArticleListView(
  articleListState: ArticleList,
  action: SetArticleListView
) {
  return { ...articleListState, view: action.view };
}

const articleLists = createReducer(
  {
    sort: 'percent',
    visibilityFilter: 'Active',
    projectFilter: 'All Projects',
    view: 'full',
    locked: false,
    search: ''
  },
  {
    SET_VISIBILITY_FILTER: setVisibilityFilter,
    SET_PROJECT_FILTER: setProjectFilter,
    SET_SORT_FILTER: setSortFilter,
    SET_ARTICLE_LIST_SEARCH: setArticleListSearch,
    SET_ARTICLE_LIST_VIEW: setArticleListView
  }
);
export default articleLists;
