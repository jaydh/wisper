import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import Footer from './ArticleListFooter';
import ProjectSelector from '../containers/ProjectSelector';
import { List } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
}

class ArticleList extends React.Component<Props, {}> {
  render() {
    const { articles, id, filters } = this.props;
    return (
      <Jumbotron>
        <AddArticle filters={filters} />
        <ProjectSelector id={id} />
        <ListGroup>
          {articles.map(article => {
            return article
              ? <ListGroupItem
                  key={article.id}
                  bsStyle={article.completed ? 'success' : 'info'}
              >
                  <Article key={article.id} {...article} />
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
