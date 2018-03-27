import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { List } from 'immutable';
import {
  pullFromFirebase,
  ListenToFirebase
} from '../actions/syncWithFirebase';
import { Icon } from 'react-fa';
import SuggestContineuArticle from './actionDispatchers/SuggestContinueArticle';
import * as Loadable from 'react-loadable';
const AsyncDailies = Loadable({
  loader: () => import('./Dailies'),
  loading: Icon
});
const AsyncDailyAnalytics = Loadable({
  loader: () => import('../components/DailyAnalytics'),
  loading: Icon
});
const AsyncArticleAnalytics = Loadable({
  loader: () => import('../components/ArticleAnalytics'),
  loading: Icon
});
const AsyncVisibleArticleList = Loadable({
  loader: () => import('./VisibleArticleList'),
  loading: Icon
});
const AsyncArticleView = Loadable({
  loader: () => import('./ArticleView'),
  loading: Icon
});
const AsyncUserPage = Loadable({
  loader: () => import('../components/UserPage'),
  loading: Icon
});

interface Props {
  uiView: string;
  fetchingArticles: boolean;
  fetchingDailies: boolean;
  demoStart: boolean;
  demoComplete: boolean;
  pullOnMount: () => void;
  listenAfterMount: () => void;
  currentArticle: ArticleType;
  articles: List<ArticleType>;
}

interface State {
  fadeIn: boolean;
  timeout?: any;
}

class AppRoutes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fadeIn: true };
  }
  toggle() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }
  componentDidMount() {
    this.props.pullOnMount();
    this.setState({
      timeout: setTimeout(() => this.props.listenAfterMount(), 2000)
    });
  }

  componentWillUmount() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
  }
  componentWillUpdate(nextProps: Props) {
    if (nextProps.uiView !== this.props.uiView) {
      this.toggle();
      setTimeout(() => this.toggle(), 500);
    }
  }

  render() {
    const { uiView } = this.props;
    return (
      <>
        {(this.props.fetchingArticles ||
          this.props.fetchingDailies ||
          (this.props.demoStart && !this.props.demoComplete)) && (
          <p
            style={{
              zIndex: 100,
              position: 'fixed',
              bottom: '0.5em',
              right: '0.5em'
            }}
          >
            <Icon spin={true} name="spinner" />{' '}
            {this.props.fetchingArticles ? 'Updating Articles' : ''}{' '}
            {this.props.fetchingDailies ? 'Updating Dailies' : ''}{' '}
            {this.props.demoStart && !this.props.demoComplete
              ? 'Populating data'
              : ''}{' '}
          </p>
        )}
        {this.props.currentArticle &&
          this.props.uiView !== 'article' && (
            <SuggestContineuArticle article={this.props.currentArticle} />
          )}
        {uiView === 'compact' && <AsyncVisibleArticleList />}
        {uiView === 'analytics' && <AsyncArticleAnalytics />}
        {uiView === 'dailies' && (
          <>
            <AsyncDailies />
            <AsyncDailyAnalytics />
          </>
        )}
        {uiView === 'User' && <AsyncUserPage />}
        {uiView === 'article' &&
          this.props.currentArticle && (
            <AsyncArticleView id={this.props.currentArticle.id} />
          )}
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  const currentArticleID = state.get('ui').currentArticle;
  return {
    uiView: state.get('ui').view,
    fetchingArticles: state.get('ui').fetchingArticles,
    fetchingDailies: state.get('ui').fetchingDailies,
    demoStart: state.get('ui').demoStart,
    demoComplete: state.get('ui').demoComplete,
    currentArticle: state
      .get('articles')
      .find((t: ArticleType) => t.id === currentArticleID),
    articles: state.get('articles')
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    pullOnMount: () => {
      dispatch(pullFromFirebase());
    },
    listenAfterMount: () => {
      dispatch(ListenToFirebase());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
