import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import ProjectSelector from '../containers/ProjectSelector';
import ActiveSelector from '../containers/ActiveSelector';
import Sort from '../containers/Sort';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { Jumbotron, ListGroup, ButtonGroup } from 'react-bootstrap';
import DeleteArticleList from '../containers/DeleteArticleList';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  order: number;
  id: string;
  sort: string;
  projectFilter: string;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, projectFilter } = this.props;
    return (
      <Jumbotron className="article-list-container">
        <DeleteArticleList id={id} />
        <AddArticle projectFilter={projectFilter} />
        <ButtonGroup>
          <ActiveSelector id={id} />
          <ProjectSelector id={id} />
          <Sort id={id} />
        </ButtonGroup>

        <h5>Count: {articles.size}</h5>
        <ListGroup>
          {articles.map((article: articleType) => {
            return <Article key={article.id} {...article} />;
          })}
        </ListGroup>
      </Jumbotron>
    );
  }
}

class OuterArticleList extends React.Component<Props> {
  render() {
    const { order } = this.props;
    const width = innerWidth * 0.8;

    return (
      <Rnd
        className="resizable-container"
        style={{
          cursor: 'auto',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
        default={{
          x: 0,
          y: 0,
          width: width,
          height: innerHeight * 0.8
        }}
        z={order}
        bounds=".canvas"
        dragHandlerClassName=".drag"
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
        resizeHandlerClasses={{
          bottomRight: 'resize'
        }}
        resizeHandlerStyles={{
          bottomRight: {
            zIndex: '100',
            border: 'solid #1290bf',
            borderWidth: '0 6px 6px 0',
            bottom: '1em',
            right: '1em',
            padding: '3px',
            position: '-webkit-sticky',
            float: 'right'
          }
        }}
      >
        <i className="drag" />
        <ArticleList {...this.props} />
      </Rnd>
    );
  }
}
export default OuterArticleList;
