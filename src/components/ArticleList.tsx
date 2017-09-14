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
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  onResize: (x: number, y: number) => void;
  onReposition: (x: number, y: number) => void;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, projectFilter } = this.props;
    return (
      <div>
        <Jumbotron
          className="article-list-container"
          style={{
            marginBottom: '0'
          }}
        >
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
      </div>
    );
  }
}

class OuterArticleList extends React.Component<Props> {
  render() {
    const {
      order,
      xPosition,
      yPosition,
      width,
      height,
      onResize,
      onReposition
    } = this.props;
    return (
      <Rnd
        className="resizable-container"
        style={{
          cursor: 'auto',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
        default={{
          x: xPosition,
          y: yPosition,
          width: width,
          height: height
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
            position: '-webkit-sticky',
            bottom: '1em',
            right: '1em',
            float: 'right'
          }
        }}
        onResizeStop={(
          e: MouseEvent | TouchEvent,
          dir: any,
          refToElement: any,
          delta: any,
          position: Position
        ) => {
          onResize(delta.width, delta.height);
        }}
        onDragStop={(e: MouseEvent | TouchEvent, data: any) => {
          onReposition(data.lastX, data.lastY);
        }}
      >
        <i className="drag" />
        <ArticleList {...this.props} />
      </Rnd>
    );
  }
}
export default OuterArticleList;
