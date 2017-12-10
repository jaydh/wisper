import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import DailyAnalytics from '../components/DailyAnalytics';
import ArticleAnalytics from '../components/ArticleAnalytics';
import VisibleArticleList from '../containers/VisibleArticleList';
import { Glyphicon } from 'react-bootstrap';
import { addArticleList } from '../actions/articleList';
import { connect } from 'react-redux';
import {
  ArticleList as ArticleListType,
  ArticleList
} from '../constants/StoreState';
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
  componentDidMount() {
    this.props.pullOnMount();
    setTimeout(() => this.props.listenAfterMount(), 2000);
  }
  render() {
    return (
      <div>
        {(this.props.fetchingArticles || this.props.fetchingDailies) && (
          <p
            style={{
              zIndex: 100,
              position: 'fixed',
              bottom: '0.5em',
              right: '0.5em'
            }}
          >
            <Glyphicon glyph="refresh" />{' '}
            {this.props.fetchingArticles ? 'Updating Articles ' : ''}
            {this.props.fetchingDailies ? 'Updating Dailies ' : ''}
          </p>
        )}
        {(() => {
          switch (this.props.uiView) {
            case 'Compact':
              if (
                !this.props.articleLists.find(
                  (t: ArticleList) => t.id === 'compactAL'
                )
              ) {
                this.props.createArticleList('compactAL');
              }
              return <VisibleArticleList id={'compactAL'} />;
            case 'Canvas':
              return <Canvas />;
            case 'Analytics':
              return <ArticleAnalytics />;
            case 'Dailies':
              return (
                <div>
                  <Dailies />
                  <DailyAnalytics />
                </div>
              );
            default:
              return (
                <div>
                  <Dailies />
                  <Canvas />
                  <ArticleAnalytics />
                  <DailyAnalytics />
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
