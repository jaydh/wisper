import { List, OrderedSet } from 'immutable';
export interface Article {
  id: string;
  link: string;

  metadata?: any;
  fetching?: boolean;
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
  sort: string;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  locked: boolean;
}

export interface StoreState {
  hash?: string;
  articleLists: OrderedSet<ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}
