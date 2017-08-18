import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Button, Jumbotron } from 'react-bootstrap';
// import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';

interface Props {
  ListenToFirebase: any;
  AddArticleList: any;
  articleLists: OrderedMap<string, ArticleList>;
}

export default class Canvas extends React.Component<Props> {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    const { ListenToFirebase, AddArticleList } = this.props;
    ListenToFirebase();
    AddArticleList();
  }

  render() {
    const { articleLists, AddArticleList } = this.props;
    return (
      <div>
        <Button onClick={() => AddArticleList()}>Add List</Button>
        <Jumbotron className="canvas">
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