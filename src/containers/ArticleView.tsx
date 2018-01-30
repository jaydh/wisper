import * as React from 'react';
import { connect } from 'react-redux';
import { Article } from '../constants/StoreState';
import ArticleMenu from './ArticleMenu';
interface Props {
  article: Article;
}

class ArticleView extends React.Component<Props> {
  render() {
    const { article } = this.props;
    const hasTitle = article.metadata
      ? article.metadata.has('title') || article.metadata.has('oGtitle')
      : false;
    const hasDescription = article.metadata
      ? article.metadata.has('description') ||
        article.metadata.has('ogDescrption')
      : false;
    const hasSiteName = article.metadata
      ? article.metadata.has('siteName') || article.metadata.has('ogSiteName')
      : false;

    return (
      <>
        {hasTitle
          ? article.metadata.get('title') || article.metadata.get('ogTitle')
          : article.link}
        {hasSiteName
          ? article.metadata.get('siteName') ||
            article.metadata.get('ogSiteName')
          : ''}
        {hasSiteName && hasDescription ? ' - ' : ''}
        {hasDescription
          ? article.metadata.get('ogDescrption') ||
            article.metadata.get('description')
          : ''}

        <ArticleMenu id={article.id} />
        {article.HTMLContent && (
          <div dangerouslySetInnerHTML={{ __html: article.HTMLContent }} />
        )}
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    article: state.get('ui').currentArticle
  };
};

export default connect(mapStateToProps)(ArticleView);
