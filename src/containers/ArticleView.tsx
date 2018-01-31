import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { Jumbotron } from 'reactstrap';
import ReactHTMLParser from 'react-html-parser';
import Article from '../components/Article';
import ExitArticleView from '../containers/actionDispatchers/ExitArticleView';

interface Props {
  article: ArticleType;
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
      <Jumbotron>
        <ExitArticleView />
        <Article article={article} />
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

        {article.HTMLContent && <>{ReactHTMLParser(article.HTMLContent)}</>}
      </Jumbotron>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    article: state
      .get('articles')
      .find((t: ArticleType) => t.id === state.get('ui').currentArticle)
  };
};

export default connect(mapStateToProps)(ArticleView);
