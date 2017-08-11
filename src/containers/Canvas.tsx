import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import addArticleList from '../actions/addArticleList';
import { Button, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';

interface Props {
  dispatch: any;
  articleLists: OrderedMap<string, ArticleList>;
}

class Canvas extends React.Component<Props> {
  render() {
    const { dispatch, articleLists } = this.props;

    return (
      <div className="container">
        <Button onClick={() => dispatch(addArticleList())}>Add List</Button>
        <Jumbotron>
          {articleLists.map((articleList: ArticleList) => {
            return (
              <VisibleArticleList
                key={articleLists.keyOf(articleList)}
                id={articleLists.keyOf(articleList)}
              />
            );
          })}
        </Jumbotron>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: dispatch
  };
};

const mapStateToProps = (state: StoreState, ownProps: any) => {
  return {
    articleLists: state.articleLists
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
