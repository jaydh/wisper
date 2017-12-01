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

interface Props {
  uiView: string;
  articleLists: List<ArticleListType>;
  createArticleList: (id: string) => void;
}
class AppRoutes extends React.Component<Props> {
  render() {
    switch (this.props.uiView) {
      case 'Compact':
        if (this.props.articleLists.size === 0) {
          this.props.createArticleList('0');
        }
        return <VisibleArticleList id={this.props.articleLists.first().id} />;
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
            <div style={{ height: '50rem' }}>
              <DailyGraph />
            </div>
          </div>
        );
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    articleLists: state.get('articleLists'),
    uiView: state.get('ui').view
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createArticleList: (id: string) => dispatch(addArticleList(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
