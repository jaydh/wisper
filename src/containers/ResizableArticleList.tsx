const Rnd = require('react-rnd').default;
import * as React from 'react';
import ArticleList from './VisibleArticleList';
import {
  resizeArticleList,
  repositionArticleList
} from '../actions/articleList';
import { connect } from 'react-redux';
import { ArticleList as ArticleListType } from '../constants/StoreState';

interface Props {
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

class ResizableArticleList extends React.Component<Props> {
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
        resizableGrid={[25, 25]}
        dragGrid={[25, 25]}
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

function mapStateToProps(state: any, ownProps: any) {
  const articleList = state
    .get('articleLists')
    .find((list: ArticleListType) => list.id === ownProps.id);

  return {
    order: articleList.order,
    sort: articleList.sort,
    projectFilter: articleList.projectFilter,
    xPosition: articleList.xPosition,
    yPosition: articleList.yPosition,
    height: articleList.height,
    width: articleList.width,
    locked: articleList.locked
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onResize: (x: number, y: number) => {
      dispatch(resizeArticleList(ownProps.id, x, y));
    },
    onReposition: (x: number, y: number) => {
      dispatch(repositionArticleList(ownProps.id, x, y));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ResizableArticleList
);
