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
import GitInfo from './GitInfo';
import '!!style-loader!css-loader!../css/styles.css';

interface Props {
  uiView: string;
  articleLists: List<ArticleListType>;
  createArticleList: (id: string) => void;
}

class App extends React.Component<Props> {
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
            <GitInfo />
          </div>
        ) : (
          <LoginLoading />
        )}
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
