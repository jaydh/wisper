import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import DailyAnalytics from '../components/DailyAnalytics';
import ArticleAnalytics from '../components/ArticleAnalytics';
import VisibleArticleList from '../containers/VisibleArticleList';
import UserPage from '../components/UserPage';
import { connect } from 'react-redux';
import { ArticleList as ArticleListType } from '../constants/StoreState';
import { List } from 'immutable';
import {
  pullFromFirebase,
  ListenToFirebase
} from '../actions/syncWithFirebase';
import { Icon } from 'react-fa';

interface Props {
  uiView: string;
  fetchingArticles: boolean;
  fetchingDailies: boolean;
  demoStart: boolean;
  demoComplete: boolean;
  articleLists: List<ArticleListType>;
  pullOnMount: () => void;
  listenAfterMount: () => void;
  createArticleList: (id: string) => void;
}

interface State {
  content: any;
  timeout?: any;
}

class AppRoutes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { content: '' };
  }
  componentDidMount() {
    this.props.pullOnMount();
    this.setState({
      timeout: setTimeout(() => this.props.listenAfterMount(), 2000)
    });
  }

  componentWillUnmount() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
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
        {(() => {
          switch (this.props.uiView) {
            case 'compact':
              return <VisibleArticleList id={'compactAL'} />;
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
            default:
              return (
                <div>
                  <Dailies />
                  <DailyAnalytics />
                </div>
              );
          }
        })()}
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    articleLists: state.get('articleLists'),
    uiView: state.get('ui').view,
    fetchingArticles: state.get('ui').fetchingArticles,
    fetchingDailies: state.get('ui').fetchingDailies,
    demoStart: state.get('ui').demoStart,
    demoComplete: state.get('ui').demoComplete
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
