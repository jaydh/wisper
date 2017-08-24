import { List, OrderedSet } from 'immutable';
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
  id: string;
  order: number;
  visibilityFilter: string;
  projectFilter: string;
}

export interface StoreState {
  hash?: string;
  articleLists: OrderedSet<ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}
