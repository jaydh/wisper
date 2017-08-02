import * as React from 'react';
import AddArticle from '../containers/AddArticle';
import VisibleArticleList from '../containers/VisibleArticleList';
import Logout from './Logout';
import 'whatwg-fetch';

interface State {
  gitCommit: string;
}

class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = { gitCommit: 'not available' };
  }

  // Gets repository information
  componentWillMount() {
    let that = this;
    fetch('https://api.github.com/repos/jaydh/wisper')
      .then(function(response: any) {
        return response.json();
      })
      .then(function(json: any) {
        console.log(json);
        that.setState({ gitCommit: json.updated_at });
      })
      .catch(function(ex: any) {
        console.log('parsing failed', ex);
      });
  }

  public render() {
    const gitDate = new Date(this.state.gitCommit);
    return (
      <div className="container">
        <div className="page-header">
          <h1>wispy</h1>
        </div>
        <div className="jumbotron">
          <AddArticle />
          <VisibleArticleList />
        </div>
        <Logout />
        <p>
          Under active development <br />
          Last commit: {gitDate.toLocaleString()}
        </p>
      </div>
    );
  }
}

export default App;
