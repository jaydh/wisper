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
import { ListGroup, ListGroupItem } from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, filters } = this.props;
    return (
      <Rnd
        className="article-list-container"
        default={{
          x: 0,
          y: 0,
          width: innerWidth * 0.5,
          height: innerHeight * 0.3
        }}
        z={2}
        bounds=".canvas"
        resizeGrid={[25, 25]}
        dragGrid={[25, 25]}
        style={{
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <ProjectSelector id={id} />
        <Footer id={id} />
        <AddArticle filters={filters} />
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
      </Rnd>
    );
  }
}
export default ArticleList;
