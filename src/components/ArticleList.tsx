import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/actionDispatchers/AddArticle';
import SetArticleListSearch from '../containers/actionDispatchers/SetArticleListSearch';
import ProjectSelector from '../containers/actionDispatchers/ProjectSelector';
import ActiveSelector from '../containers/actionDispatchers/ActiveSelector';
import Sort from '../containers/actionDispatchers/Sort';
import DeleteArticleList from '../containers/actionDispatchers/DeleteArticleList';
import MaximizedArticleList from '../containers/actionDispatchers/MaximizeArticleList';
import LockArticleList from '../containers/actionDispatchers/LockArticleList';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import {
  Glyphicon,
  Jumbotron,
  ListGroup,
  ButtonGroup,
  Row,
  Col,
  Grid
} from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  articlesInActivity: List<articleType>;
  order: number;
  id: string;
  sort: string;
  projectFilter: string;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  locked: boolean;
  onResize: (x: number, y: number) => void;
  onReposition: (x: number, y: number) => void;
}

class ArticleList extends React.Component<Props> {
  render() {
    const {
      articles,
      id,
      projectFilter,
      articlesInActivity,
      locked
    } = this.props;
    return (
      <div>
        <Jumbotron
          className="article-list-container"
          style={{
            padding: '2rem'
          }}
        >
          <Grid>
            <Row>
              <Col sm={1} md={1}>
                <LockArticleList id={id} />
              </Col>
              <Col sm={2} md={2} smOffset={9} mdOffset={9}>
                {!locked && (
                  <ButtonGroup>
                    <MaximizedArticleList id={id} />
                    <DeleteArticleList id={id} />
                  </ButtonGroup>
                )}
              </Col>
            </Row>
            <div style={{ marginTop: '3em' }} />
            <Row>
              <Col style={{ float: 'left' }}>
                <AddArticle projectFilter={projectFilter} />
              </Col>
              <Col style={{ float: 'right' }}>
                <SetArticleListSearch id={id} />
              </Col>
            </Row>
            <Row>
              <Col>
                <ButtonGroup>
                  <ActiveSelector id={id} />
                  <ProjectSelector
                    id={id}
                    articlesInActivity={articlesInActivity}
                  />
                  <Sort id={id} />
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <p style={{ float: 'right' }}>
                <Glyphicon glyph="list-alt" /> {articles.size}
              </p>
              <ListGroup>
                {articles.map((article: articleType) => {
                  return <Article key={id + article.id} article={article} />;
                })}
              </ListGroup>
            </Row>
          </Grid>
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
      onReposition,
      locked
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
        bounds=".articlelist-canvas"
        dragHandlerClassName=".drag"
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: !locked,
          bottomLeft: false,
          topLeft: false
        }}
        disableDragging={locked}
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
        {!locked && <i className="drag" />}
        <ArticleList {...this.props} />
      </Rnd>
    );
  }
}
export default OuterArticleList;
