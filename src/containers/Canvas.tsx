import * as React from 'react';
import { connect } from 'react-redux';
import { ListenToFirebase } from '../actions/syncWithFirebase';
import { Jumbotron } from 'react-bootstrap';
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
    const { articleLists } = this.props;
    return (
      <div>
        {articleLists.size !== 0 && (
          <Jumbotron
            className="canvas articlelist-canvas"
            style={{ height: innerHeight }}
          >
            {articleLists.map((articleList: ArticleList) => {
              return (
                <VisibleArticleList key={articleList.id} id={articleList.id} />
              );
            })}
          </Jumbotron>
        )}
        <Graph />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
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
