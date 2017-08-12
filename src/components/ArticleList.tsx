import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import Footer from './ArticleListFooter';
import ProjectSelector from '../containers/ProjectSelector';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

interface Props {
  articles: List<articleType>;
  onArticleClick: any;
  id: string;
}

class ArticleList extends React.Component<Props, {}> {

  render() {
    const { articles, onArticleClick, id } = this.props;
    return (
      <Jumbotron>
        <AddArticle id={id} />
        <ProjectSelector id={id} />
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
