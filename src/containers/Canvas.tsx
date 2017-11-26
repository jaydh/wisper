import * as React from 'react';
import { connect } from 'react-redux';
import AddArticleList from '../containers/actionDispatchers/AddArticleList';
import { Jumbotron } from 'react-bootstrap';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import VisibleArticleList from '../containers/VisibleArticleList';
import {
  pullFromFirebase,
  ListenToFirebase
} from '../actions/syncWithFirebase';

interface Props {
  pullOnMount: () => void;
  listenAfterMount: () => void;
  addArticleList: () => void;
  articleLists: OrderedMap<string, ArticleList>;
}

class Canvas extends React.Component<Props> {
  componentWillMount() {
    this.props.pullOnMount();
  }

  componentDidMount() {
    this.props.listenAfterMount();
  }
  render() {
    const { articleLists } = this.props;
    return (
      <div>
        <AddArticleList />
        <Jumbotron
          className="canvas articlelist-canvas"
          id="canvas"
          style={{ height: innerHeight }}
        >
          {articleLists.map((articleList: ArticleList) => {
            return (
              <VisibleArticleList key={articleList.id} id={articleList.id} />
            );
          })}
        </Jumbotron>
        )
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleLists: state.get('articleLists')
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    pullOnMount: () => {
      dispatch(pullFromFirebase);
    },
    listenAfterMount: () => {
      dispatch(ListenToFirebase());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
