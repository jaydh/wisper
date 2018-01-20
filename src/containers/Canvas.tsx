import * as React from 'react';
import { connect } from 'react-redux';
import AddArticleList from '../containers/actionDispatchers/AddArticleList';
import { Container, Col, Jumbotron } from 'reactstrap';
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
      <Container>
        <Col xsOffset={11} smOffset={11} mdOffset={11} lgOffset={11}>
          <AddArticleList />
        </Col>
        <Jumbotron
          className="canvas articlelist-canvas"
          id="canvas"
          style={{ height: innerHeight }}
        >
          {articleLists
            .filter((t: ArticleList) => t.id !== 'compactAL')
            .map((articleList: ArticleList) => {
              return (
                <ResizableArticleList
                  key={articleList.id}
                  id={articleList.id}
                />
              );
            })}
        </Jumbotron>
      </Container>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleLists: state.get('articleLists')
  };
};
export default connect(mapStateToProps)(Canvas);
