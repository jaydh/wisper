import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import DailyGraph from '../containers/graphs/DailyGraph';
import DailyCompletionGraph from '../containers/graphs/DailyCompletionGraphs';
import Analytics from '../containers/Analytics';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Grid, Row } from 'react-bootstrap';
import { addArticleList } from '../actions/articleList';
import { connect } from 'react-redux';
import { ArticleList as ArticleListType } from '../constants/StoreState';
import { List } from 'immutable';
import {
  pullFromFirebase,
  ListenToFirebase
} from '../actions/syncWithFirebase';
interface Props {
  uiView: string;
  fetchingArticles: boolean;
  fetchingDailies: boolean;
  articleLists: List<ArticleListType>;
  pullOnMount: () => void;
  listenAfterMount: () => void;
  createArticleList: (id: string) => void;
}
class AppRoutes extends React.Component<Props> {
  componentWillMount() {
    this.props.pullOnMount();
  }

  componentDidMount() {
    this.props.listenAfterMount();
  }
  render() {
    return (
      <div>
        {(() => {
          switch (this.props.uiView) {
            case 'Compact':
              if (this.props.articleLists.size === 0) {
                this.props.createArticleList('0');
              }
              return (
                <VisibleArticleList id={this.props.articleLists.first().id} />
              );
            case 'Canvas':
              return <Canvas />;
            case 'Analytics':
              return <Analytics />;
            case 'Dailies':
              return (
                <Grid>
                  <Row>
                    <Dailies />
                  </Row>
                  <DailyGraph />
                  <Row>
                    <DailyCompletionGraph />
                  </Row>
                </Grid>
              );
            case 'Canvase':
              return <Canvas />;
            default:
              return (
                <div>
                  <Dailies />
                  <Canvas />
                  <Analytics />
                  <DailyGraph />
                  <DailyCompletionGraph />
                </div>
              );
          }
        })()}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    articleLists: state.get('articleLists'),
    uiView: state.get('ui').view,
    fetchingArticles: state.get('ui').fetchingArticles,
    fetchingDailies: state.get('ui').fetchingDailies
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createArticleList: (id: string) => dispatch(addArticleList(id)),
    pullOnMount: () => {
      dispatch(pullFromFirebase());
    },
    listenAfterMount: () => {
      dispatch(ListenToFirebase());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
