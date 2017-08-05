import * as React from 'react';
import Article from './Article';
import Footer from './Footer';
import ProjectsFooter from '../containers/ProjectSelector';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

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
      <Jumbotron>
        <ProjectsFooter />
        <ListGroup>
          {articles.map(article => {
            return article
              ? (
                <ListGroupItem key={article.id} bsStyle={article.completed ? 'success' : 'info'}>
                  <Article
                    key={article.id}
                    {...article}
                    onClick={() => onArticleClick(article.id)}

                  />
                </ListGroupItem>)
              : <br />;
          })}
        </ListGroup>
        <Footer />
      </Jumbotron>
    );
  }
}
export default ArticleList;
