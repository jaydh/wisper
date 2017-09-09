import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Modal, Jumbotron, Button } from 'react-bootstrap';
// import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
import Graph from '../containers/Graph';

interface Props {
  ListenToFirebase: () => void;
  AddArticleList: () => void;
  articleLists: OrderedMap<string, ArticleList>;
}

interface State {
  showModal: boolean;
}

export default class Canvas extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { showModal: false };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  componentWillMount() {
    const { ListenToFirebase } = this.props;
    ListenToFirebase();
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    const { articleLists, AddArticleList } = this.props;
    return (
      <div>
        <Modal show={this.state.showModal} onHide={() => this.close()}>
          <Modal.Body>
            <Graph />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Button bsStyle="addList" onClick={() => AddArticleList()}>
          Add List
        </Button>
        <Button bsStyle="analytics" onClick={() => this.open()}>
          Analytics
        </Button>
        <Jumbotron className="canvas" style={{ height: innerHeight }}>
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
