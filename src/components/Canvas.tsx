import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Button, Jumbotron } from 'react-bootstrap';
// import { StoreState } from '../constants/StoreState';
import { OrderedMap } from 'immutable';
import { ArticleList } from '../constants/StoreState';
let Draggable = require('react-draggable');

interface Props {
  ListenToFirebase: any;
  AddArticleList: any;
  articleLists: OrderedMap<string, ArticleList>;
}

interface State {
  activeDrags: number;
  deltaPosition: { x: number; y: number };
}

export default class Canvas extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      activeDrags: 0,
      deltaPosition: {
        x: 0,
        y: 0
      }
    };
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
  }
  onStart() {
    this.setState({ activeDrags: this.state.activeDrags + 1 });
  }

  onStop() {
    this.setState({ activeDrags: this.state.activeDrags - 1 });
  }

  handleDrag(e: any, ui: any) {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  }

  componentWillMount() {
    const { ListenToFirebase, AddArticleList } = this.props;
    ListenToFirebase();
    AddArticleList();
  }

  render() {
    const { articleLists, AddArticleList } = this.props;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <div>
        <Button onClick={() => AddArticleList()}>Add List</Button>
        <Jumbotron className="canvas">
          {articleLists.map((articleList: ArticleList) => {
            return (
              <Draggable
                key={articleList.id}
                bounds=".canvas"
                handle="strong"
                {...dragHandlers}
              >
                <div className="box no-cursor">
                  <strong className="cursor">
                    <Button>Drag here</Button>
                  </strong>
                  <VisibleArticleList id={articleList.id} />
                </div>
              </Draggable>
            );
          })}
        </Jumbotron>
      </div>
    );
  }
}
