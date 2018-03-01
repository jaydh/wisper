import * as React from 'react';
import { Jumbotron } from 'reactstrap';
import ArticleList from './VisibleArticleList';

class Canvas extends React.Component {
  render() {
    return (
      <Jumbotron
        className="canvas articlelist-canvas"
        id="canvas"
        style={{ height: innerHeight }}
      >
        ><ArticleList />
      </Jumbotron>
    );
  }
}
export default Canvas;
