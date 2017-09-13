import { OrderedSet } from 'immutable';
import createReducer from './createReducer';
import { AddArticleList, DeleteArticleList } from '../actions/articleList';
import { SetVisbilityFilter } from '../actions/visibilityFilter';
import { SetProjectFilter } from '../actions/projectFilter';
import { ArticleList } from '../constants/StoreState';
import { SetSortFilter } from '../actions/setSortFilter';

function addArticleList(
  articleListState: OrderedSet<ArticleList>,
  action: AddArticleList
): OrderedSet<ArticleList> {
  const id =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  const order = articleListState.size;

  return articleListState.add({
    id,
    order,
    sort: 'date-desc',
    visibilityFilter: 'Active',
    projectFilter: 'All'
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
const articleLists = createReducer(OrderedSet<ArticleList>(), {
  ADD_ARTICLE_LIST: addArticleList,
  DELETE_ARTICLE_LIST: deleteArticleList,
  SET_VISIBILITY_FILTER: setVisibilityFilter,
  SET_PROJECT_FILTER: setProjectFilter,
  SET_SORT_FILTER: setSortFilter
});
export default articleLists;
