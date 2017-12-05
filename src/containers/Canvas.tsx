import * as React from 'react';
import { connect } from 'react-redux';
import AddArticleList from '../containers/actionDispatchers/AddArticleList';
import { Jumbotron } from 'react-bootstrap';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import ResizableArticleList from '../containers/ResizableArticleList';

interface Props {
  addArticleList: () => void;
  articleLists: OrderedMap<string, ArticleList>;
}

class Canvas extends React.Component<Props> {
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
          {articleLists
            .filter((t: ArticleList) => t.id !== '0')
            .map((articleList: ArticleList) => {
              return (
                <ResizableArticleList
                  key={articleList.id}
                  id={articleList.id}
                />
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
export default connect(mapStateToProps)(Canvas);
