import { List, Set } from 'immutable';
import { Moment } from 'moment';
export interface Article {
  id: string;
  link: string;
  metadata?: any;
  fetching?: boolean;
  dateAdded: Moment;
  dateRead?: Moment;
  projects?: Object;
  viewedOn: Set<Moment>;
  completed: boolean;
}

export interface Daily {
  id: string;
  title: string;
  createdOn: Moment;
  completedOn: Set<Moment>;
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
}

export interface StoreState {
  hash?: string;
  articleLists: Set<ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}
