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
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const readability = require('readability-node');
const Readability = readability.Readability;

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

    JSDOM.fromURL('https://www.ostechnix.com/yay-found-yet-another-reliable-aur-helper/', {}).then(dom => {
      const loc = dom.window.location;
      var uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + '//' + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(':')),
        pathBase:
          loc.protocol +
          '//' +
          loc.host +
          loc.pathname.substr(0, loc.pathname.lastIndexOf('/') + 1)
      };

      const article = new Readability(uri, dom.window.document).parse();
      console.log(article);
      return article.content;
    }).then(content => this.setState({ content }));
  }

  componentWillUnmount() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
  }

  render() {
    console.log(this.state.content);
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: (this.state.content) }} />        {(this.props.fetchingArticles ||
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
