import { List } from 'immutable';
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

export interface StoreState {
  hash?: string;
  visibilityFilter: string;
  projectFilter: List<String>;
  articles: List<Article>;
  projects?: List<String>;
}
