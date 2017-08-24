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
import { Button, Jumbotron, ListGroup, ListGroupItem } from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
  articleListNum: number;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, filters } = this.props;
    return (
      <Jumbotron className="article-list-container">
        <Button className="drag" bsStyle="drag">
          {' '}
        </Button>
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
      </Jumbotron>
    );
  }
}

class OuterArticleList extends React.Component<Props> {
  render() {
    const { articleListNum } = this.props;
    return (
      <Rnd
        className="resizable-container"
        default={{
          x: innerWidth * 0.7 / articleListNum * (articleListNum - 1) ,
          y: 0,
          width: innerWidth * 0.7 / articleListNum,
          height: innerHeight * 0.6
        }}
        z={0}
        bounds=".canvas"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        dragHandlerClassName=".drag"
        enableResizing={{
          top: false,
          right: true,
          bottom: true,
          left: true,
          topRight: false,
          bottomRight: true,
          bottomLeft: true,
          topLeft: false
        }}
      >
        <ArticleList {...this.props} />
      </Rnd>
    );
  }
}
export default OuterArticleList;
