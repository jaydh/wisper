export interface SetArticleViewFontSize {
  type: 'SET_ARTICLE_VIEW_FONT_SIZE';
  size: number;
}

export default function setArticleViewFontSize(
  size: number
): SetArticleViewFontSize {
  return {
    type: 'SET_ARTICLE_VIEW_FONT_SIZE',
    size
  };
}
