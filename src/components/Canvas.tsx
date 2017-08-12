import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Button, Jumbotron } from 'react-bootstrap';
// import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';

interface Props {
  ListenToFirebase: any;
  onAddArticleList: any;
  articleLists: OrderedMap<string, ArticleList>;
}

export default class Canvas extends React.Component<Props> {
  componentWillMount() {
    const { ListenToFirebase } = this.props;
    ListenToFirebase();
  }

  render() {
    const { articleLists, onAddArticleList } = this.props;
    return (
      <div className="container">
        <Button onClick={() => onAddArticleList()}>Add List</Button>
        <Jumbotron>
          {articleLists.map((articleList: ArticleList) => {
            return (
              <VisibleArticleList key={articleList.id} id={articleList.id} />
            );
          })}
        </Jumbotron>
      </div>
    );
  }
}
