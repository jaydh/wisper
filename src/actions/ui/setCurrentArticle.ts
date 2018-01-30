import { Article } from '../../constants/StoreState';

export interface SetCurrentArticle {
  type: 'SET_CURRENT_ARTICLE';
  article: Article;
}
export default function setCurrentArticle(article: Article): SetCurrentArticle {
  return {
    type: 'SET_CURRENT_ARTICLE',
    article
  };
}