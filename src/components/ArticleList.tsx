import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import Footer from './Footer';
import ProjectsFooter from '../containers/ProjectSelector';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

interface Props {
  articles: List<articleType>;
  ListenToFirebase: any;
  onArticleClick: any;
  id: string;
}

class ArticleList extends React.Component<Props, {}> {
  componentDidMount() {
    const { ListenToFirebase } = this.props;
    ListenToFirebase();
  }

  render() {
    const { articles, onArticleClick, id } = this.props;
    return (
      <Jumbotron>
        <AddArticle id={id} />
        <ProjectsFooter id={id} />
        <ListGroup>
          {articles.map(article => {
            return article
              ? <ListGroupItem
                key={article.id}
                bsStyle={article.completed ? 'success' : 'info'}
              >
                <Article
                  key={article.id}
                  {...article}
                  onClick={() => onArticleClick(article.id)}
                />
              </ListGroupItem>
              : <br />;
          })}
        </ListGroup>
        <Footer id={id} />
      </Jumbotron>
    );
  }
}
export default ArticleList;
