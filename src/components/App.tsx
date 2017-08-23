import * as React from 'react';
import Logout from './Logout';
import { PageHeader } from 'react-bootstrap';
import 'whatwg-fetch';
import Canvas from '../containers/CanvasContainer';
import '!!style-loader!css-loader!../css/styles.css';
import Graph from '../containers/Graph';

interface State {
  gitCommit: string;
  sidebarOpen: boolean;
}

class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      gitCommit: '',
      sidebarOpen: false
    };
  }

  // Gets repository information
  componentWillMount() {
    const that = this;
    fetch('https://api.github.com/repos/jaydh/wispy')
      .then(function (response: any) {
        return response.json();
      })
      .then(function (json: any) {
        that.setState({ gitCommit: json.pushed_at });
      })
      .catch(function (ex: any) {
        console.log('parsing failed', ex);
      });
  }

  render() {
    const gitDate = new Date(this.state.gitCommit);
    
    return (
      
        <div className="container-fluid">
        <PageHeader>
          <h1>wispy</h1>
        </PageHeader>
        <Canvas /><Graph />
        <Logout />
        <p>
          Under active development <br />
          Last updated: {gitDate.toLocaleString()} <br />
          Github Repo: <a>https://github.com/jaydh/wispy</a>
        </p>
        </div>
    );
  }
}

export default App;
