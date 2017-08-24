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
  order: number;
  id: string;
  articleList: ArticleListType;
  articleListNum: number;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, articleList } = this.props;
    return (
      <Jumbotron className="article-list-container">
        <Button className="drag" bsStyle="drag">
          {' '}
        </Button>
        <ProjectSelector id={id} />
        <Footer id={id} />
        <AddArticle articleList={articleList} />
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
    const { order } = this.props;
    const width = innerWidth * 0.7;

    return (
      <Rnd
        className="resizable-container"
        default={{
          x: width * order,
          y: 0,
          width: width,
          height: innerHeight * 0.8
        }}
        z={order}
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
