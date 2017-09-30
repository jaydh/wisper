import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Jumbotron, Button } from 'react-bootstrap';
// import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import Graph from '../containers/Graph';

interface Props {
  ListenToFirebase: () => void;
  AddArticleList: () => void;
  articleLists: OrderedMap<string, ArticleList>;
}

export default class Canvas extends React.Component<Props> {
  componentWillMount() {
    const { ListenToFirebase } = this.props;
    ListenToFirebase();
  }

  render() {
    const { articleLists, AddArticleList } = this.props;
    return (
      <div>
        <Button
          bsStyle="addList"
          bsSize="large"
          onClick={() => AddArticleList()}
        >
          Add List
        </Button>
        <Jumbotron className="canvas" style={{ height: innerHeight }}>
          {articleLists.map((articleList: ArticleList) => {
            return (
              <VisibleArticleList key={articleList.id} id={articleList.id} />
            );
          })}
        </Jumbotron>
        <Graph />
      </div>
    );
  }
}
