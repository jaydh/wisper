import { List, Set } from 'immutable';
export interface Article {
  id: string;
  link: string;
  metadata?: any;
  fetching?: boolean;
  dateAdded: Date;
  dateRead?: Date;
  projects: Set<String>;
  viewedOn: Set<Date>;
  completed: boolean;
}

export interface Daily {
  id: string;
  title: string;
  createdOn: Date;
  completedOn: List<Date>;
  completed: boolean;
  streakCount: number;
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
  search: string;
  view: string;
}

export interface StoreState {
  hash?: string;
  articleLists: Set<ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}
