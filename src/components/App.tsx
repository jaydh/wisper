import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import DailyGraph from '../containers/graphs/DailyGraph';
import Analytics from '../containers/Analytics';
import LoginLoading from './LoginLoading';
import { PageHeader } from 'react-bootstrap';
import { auth } from '../firebase';
import Menu from '../containers/Menu';
import { connect } from 'react-redux';
import { ArticleList as ArticleListType } from '../constants/StoreState';
import { List } from 'immutable';
import { addArticleList } from '../actions/articleList';
import ArticleList from '../containers/VisibleArticleList';
import '!!style-loader!css-loader!../css/styles.css';

interface Props {
  uiView: string;
  articleLists: List<ArticleListType>;
  createArticleList: (id: string) => void;
}

interface State {
  gitCommit: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gitCommit: ''
    };
  }

  // Gets repository information
  componentDidMount() {
    const that = this;
    fetch('https://api.github.com/repos/jaydh/wispy')
      .then(function(response: any) {
        return response.json();
      })
      .then(function(json: any) {
        that.setState({ gitCommit: json.pushed_at });
      })
      .catch(function(ex: any) {
        console.log('parsing failed', ex);
      });
  }

  render() {
    return (
      <div className="container-fluid app-container">
        {auth().currentUser && <Menu />}
        <PageHeader>wispy</PageHeader>
        {auth().currentUser ? (
          <div>
            {(() => {
              switch (this.props.uiView) {
                case 'Compact':
                  if (this.props.articleLists.size === 0) {
                    this.props.createArticleList('0');
                  }
                  return (
                    <ArticleList id={this.props.articleLists.first().id} />
                  );
                case 'Canvas':
                  return <Canvas />;
                case 'Analytics':
                  return <Analytics />;
                case 'Dailies':
                  return (
                    <div>
                      <Dailies />
                      <DailyGraph />
                    </div>
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
            })()}
          </div>
        ) : (
          <LoginLoading />
        )}
        <h2 style={{ fontSize: '1em' }}>
          Under active development; Last updated:{' '}
          {new Date(this.state.gitCommit).toLocaleString()} <br />
          Source: <a>{'https://github.com/jaydh/wispy'}</a>
        </h2>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
