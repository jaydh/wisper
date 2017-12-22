import { ArticleList } from './../constants/StoreState';
import { OrderedSet } from 'immutable';
import createReducer from './createReducer';
import {
  AddArticleList,
  DeleteArticleList,
  ResizeArticleList,
  RepositionArticleList,
  ToggleLockArticleList,
  SetArticleListSearch,
  SetArticleListView
} from '../actions/ui/articleList';
import { SetVisbilityFilter } from '../actions/ui/visibilityFilter';
import { SetProjectFilter } from '../actions/ui/projectFilter';
import { SetSortFilter } from '../actions/ui/setSortFilter';

function addArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: AddArticleList
): OrderedSet<ArticleList> {
  const id = action.id
    ? action.id
    : Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

  const order = articleListState.size;

  return articleListState.add({
    id,
    order,
    sort: 'date-asc',
    visibilityFilter: 'Active',
    projectFilter: 'All',
    view: 'full',
    xPosition: 0,
    yPosition: 0,
    width: innerWidth * 0.5,
    height: innerHeight * 0.8,
    locked: false,
    search: ''
  });
}

function deleteArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: DeleteArticleList
): OrderedSet<ArticleList> {
  // Not sure why I have to typecast this
  return articleListState.filter(
    (t: ArticleList) => t.id !== action.id
  ) as OrderedSet<ArticleList>;
}

function setVisibilityFilter(
  articleListState: OrderedSet<ArticleList>,
  action: SetVisbilityFilter
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? { ...list, visibilityFilter: action.filter }
      : list;
  });
}

function setProjectFilter(
  articleListState: OrderedSet<ArticleList>,
  action: SetProjectFilter
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? { ...list, projectFilter: action.filter }
      : list;
  });
}

function setSortFilter(
  articleListState: OrderedSet<ArticleList>,
  action: SetSortFilter
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id ? { ...list, sort: action.filter } : list;
  });
}

function resizeArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: ResizeArticleList
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? {
          ...list,
          width: list.width + action.x > 0 ? list.width + action.x : 0,
          height: list.height + action.y > 0 ? list.height + action.y : 0
        }
      : list;
  });
}

function repositionArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: RepositionArticleList
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? {
          ...list,
          xPosition: action.x,
          yPosition: action.y
        }
      : list;
  });
}

function toggleLockArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: ToggleLockArticleList
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? {
          ...list,
          locked: !list.locked
        }
      : list;
  });
}

function setArticleListSearch(
  articleListState: OrderedSet<ArticleList>,
  action: SetArticleListSearch
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? {
          ...list,
          search: action.search
        }
      : list;
  });
}

function setArticleListView(
  articleListState: OrderedSet<ArticleList>,
  action: SetArticleListView
) {
  return articleListState.map((list: ArticleList) => {
    return list.id === action.id
      ? {
          ...list,
          view: action.view
        }
      : list;
  });
}

const articleLists = createReducer(
  OrderedSet<ArticleList>([
    {
      id: 'compactAL',
      order: 1,
      sort: 'date-asc',
      visibilityFilter: 'Active',
      projectFilter: 'All',
      view: 'full',
      xPosition: 0,
      yPosition: 0,
      width: innerWidth * 0.5,
      height: innerHeight * 0.8,
      locked: false,
      search: ''
    }
  ]),
  {
    ADD_ARTICLE_LIST: addArticleList,
    DELETE_ARTICLE_LIST: deleteArticleList,
    SET_VISIBILITY_FILTER: setVisibilityFilter,
    SET_PROJECT_FILTER: setProjectFilter,
    SET_SORT_FILTER: setSortFilter,
    RESIZE_ARTICLE_LIST: resizeArticleList,
    REPOSITION_ARTICLE_LIST: repositionArticleList,
    LOCK_ARTICLE_LIST: toggleLockArticleList,
    SET_ARTICLE_LIST_SEARCH: setArticleListSearch,
    SET_ARTICLE_LIST_VIEW: setArticleListView
  }
);
export default articleLists;
