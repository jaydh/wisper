import * as React from 'react';
import { connect } from 'react-redux';
import { ListenToFirebase } from '../actions/syncWithFirebase';
import { addArticleList } from '../actions/articleList';
import { Jumbotron, Button } from 'react-bootstrap';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import VisibleArticleList from '../containers/VisibleArticleList';
import Graph from './graphs/Graph';

interface Props {
  listenOnMount: () => void;
  AddArticleList: () => void;
  articleLists: OrderedMap<string, ArticleList>;
}

class Canvas extends React.Component<Props> {
  componentWillMount() {
    this.props.listenOnMount();
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
        <Jumbotron>
          <Graph />
        </Jumbotron>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    AddArticleList: () => {
      dispatch(addArticleList());
    },
    listenOnMount: () => {
      dispatch(ListenToFirebase());
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleLists: state.get('articleLists')
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
