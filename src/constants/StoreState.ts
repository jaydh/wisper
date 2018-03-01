import { List, Set, Map } from 'immutable';
export interface Article {
  id: string;
  link: string;
  metadata: Map<string, any>;
  fetching?: boolean;
  dateAdded: Date;
  dateRead?: Date;
  projects: Set<String>;
  viewedOn: Set<Date>;
  completed: boolean;
  HTMLContent?: string;
  bookmark?: string;
  progress: number;
  title: string;
}

export interface Daily {
  id: string;
  title: string;
  createdOn: Date;
  completedOn: List<Date>;
  finalized: boolean;
  streakCount: number;
}

export interface ArticleList {
  visibilityFilter: string;
  projectFilter: string;
  sort: string;
  search: string;
  view: string;
}

export interface StoreState {
  hash?: string;
  articleLists: Set<ArticleList>;
  articles: List<Article>;
  projects?: List<String>;
}

export interface Project {
  dictionary: List<string>;
  id: string;
  finalized: boolean;
}
