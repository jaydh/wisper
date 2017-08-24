import { OrderedSet } from 'immutable';
import createReducer from './createReducer';
import { SetVisbilityFilter } from '../actions/visibilityFilter';
import { SetProjectFilter } from '../actions/projectFilter';
import { ArticleList } from '../constants/StoreState';

function addArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: any
): OrderedSet<ArticleList> {
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  
  const order = articleListState.size;

  return articleListState.add({
    id,
    order,
    visibilityFilter: 'SHOW_ACTIVE',
    projectFilter: 'ALL'
  });
}

function setVisibilityFilter(
  articleListState: OrderedSet<ArticleList>,
  action: SetVisbilityFilter
) {
  return articleListState
    ? articleListState.map((list: ArticleList) => {
        return list.id === action.id
          ? { ...list, visibilityFilter: action.filter }
          : list;
      })
    : articleListState;
}

function setProjectFilter(
  articleListState: OrderedSet<ArticleList>,
  action: SetProjectFilter
) {
  return articleListState
    ? articleListState.map((list: ArticleList) => {
        return list.id === action.id
          ? { ...list, projectFilter: action.filter }
          : list;
      })
    : articleListState;
}

const articleLists = createReducer(OrderedSet<ArticleList>(), {
  ADD_ARTICLE_LIST: addArticleList,
  SET_VISIBILITY_FILTER: setVisibilityFilter,
  SET_PROJECT_FILTER: setProjectFilter
});
export default articleLists;
