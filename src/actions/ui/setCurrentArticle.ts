export interface SetCurrentArticle {
  type: 'SET_CURRENT_ARTICLE';
  id: string;
}
export default function setCurrentArticle(id: string): SetCurrentArticle {
  return {
    type: 'SET_CURRENT_ARTICLE',
    id
  };
}
