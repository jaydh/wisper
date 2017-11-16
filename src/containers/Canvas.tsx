import * as React from 'react';
import { connect } from 'react-redux';
import { ListenToFirebase } from '../actions/syncWithFirebase';
import AddArticleList from '../containers/actionDispatchers/AddArticleList';
import { Jumbotron } from 'react-bootstrap';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import VisibleArticleList from '../containers/VisibleArticleList';

interface Props {
  listenOnMount: () => void;
  addArticleList: () => void;
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
        <AddArticleList />
        <Jumbotron
          className="canvas articlelist-canvas"
          id="canvas"
          style={{ height: innerHeight * 2 }}
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
