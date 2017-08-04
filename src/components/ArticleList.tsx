import * as React from 'react';
import Article from './Article';
import Footer from './Footer';
import ProjectsFooter from '../containers/ProjectsFooter';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';

interface Props {
  articles: List<articleType>;
  ListenToFirebase: any;
  onArticleClick: any;
}

class ArticleList extends React.Component<Props, {}> {
  componentDidMount() {
    const { ListenToFirebase } = this.props;
    ListenToFirebase();
  }
  render() {
    const { articles, onArticleClick } = this.props;
    return (
      <div className="Col-lg-3 Col-md-3">
        <ul>
          {articles.map(article => {
            return article
              ? <Article
                  key={article.id}
                  {...article}
                  onClick={() => onArticleClick(article.id)}
              />
              : <br />;
          })}
        </ul>
        <Footer />
        <ProjectsFooter />
      </div>
    );
  }
}
export default ArticleList;
