import { List } from 'immutable';
export interface Article {
  id: string;
  link: string;

  metadata?: Object;
  dateAdded: string;
  dateRead?: string;
  lastViewed?: string;

  completed: boolean;
}

export interface StoreState {
  hash?: string;
  visibilityFilter: string;
  articles: List<Article>;
}
