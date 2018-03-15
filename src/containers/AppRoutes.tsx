import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import DailyAnalytics from '../components/DailyAnalytics';
import ArticleAnalytics from '../components/ArticleAnalytics';
import VisibleArticleList from '../containers/VisibleArticleList';
import ArticleView from '../containers/ArticleView';
import UserPage from '../components/UserPage';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { List } from 'immutable';
import {
  pullFromFirebase,
  ListenToFirebase
} from '../actions/syncWithFirebase';
import { Icon } from 'react-fa';
import { Fade } from 'reactstrap';
import SuggestContineuArticle from './actionDispatchers/SuggestContinueArticle';

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
        <Fade in={true}>
          {(() => {
            switch (this.props.uiView) {
              case 'compact':
                return <VisibleArticleList />;
              case 'canvas':
                return <Canvas />;
              case 'analytics':
                return <ArticleAnalytics />;
              case 'dailies':
                return (
                  <div>
                    <Dailies />
                    <DailyAnalytics />
                  </div>
                );
              case 'User':
                return <UserPage />;
              case 'article':
                return this.props.currentArticle ? (
                  <ArticleView id={this.props.currentArticle.id} />
                ) : (
                  <VisibleArticleList id={'compactAL'} />
                );
              default:
                return (
                  <div>
                    <Dailies />
                    <DailyAnalytics />
                  </div>
                );
            }
          })()}
        </Fade>
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
