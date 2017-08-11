import { List, OrderedMap } from 'immutable';
export interface Article {
  id: string;
  link: string;

  metadata?: Object;
  dateAdded: string;
  dateRead?: string;
  lastViewed?: string;
  projects?: Object;
  completed: boolean;
}

export interface ArticleList {
  visibilityFilter: string;
  projectFilter: string;
}

export interface StoreState {
  hash?: string;
  articleLists: OrderedMap<string, ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}
