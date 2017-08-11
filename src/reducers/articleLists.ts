import { OrderedMap } from 'immutable';
import createReducer from './createReducer';
import { SetVisbilityFilter } from '../actions/visibilityFilter';
import { SetProjectFilter } from '../actions/projectFilter';
import { ArticleList } from '../constants/StoreState';

function addArticleList(
  articleListState: OrderedMap<string, ArticleList>,
  action: any
): OrderedMap<string, ArticleList> {
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return articleListState.set(id, {
    visibilityFilter: 'SHOW_ALL',
    projectFilter: 'ALL'
  });
}

function setVisibilityFilter(
  articleListsState: OrderedMap<string, ArticleList>,
  action: SetVisbilityFilter
) {
  return articleListsState
    ? articleListsState.update(action.id, (list: ArticleList) => {
        list.visibilityFilter = action.filter;
        return list;
      })
    : articleListsState;
}

function setProjectFilter(
  articleListsState: OrderedMap<string, ArticleList>,
  action: SetProjectFilter
) {
  return articleListsState
    ? articleListsState.update(action.id, (list: ArticleList) => {
        list.projectFilter = action.filter;
        return list;
      })
    : articleListsState;
}

const articleLists = createReducer(
  OrderedMap<string, ArticleList>({
    '0': { visibilityFilter: 'SHOW_ACTIVE', projectFilter: 'ALL' }
  }),
  {
    ADD_ARTICLE_LIST: addArticleList,
    SET_VISIBILITY_FILTER: setVisibilityFilter,
    SET_PROJECT_FILTER: setProjectFilter
  }
);
export default articleLists;
