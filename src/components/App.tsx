import * as React from 'react';
import Logout from './Logout';
import { PageHeader } from 'react-bootstrap';
import 'whatwg-fetch';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import LoginLoading from './LoginLoading';
import { auth } from '../firebase';
import '!!style-loader!css-loader!../css/styles.css';
import Menu from './Menu';
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
    const gitDate = new Date(this.state.gitCommit);
    return (
      <div className="container-fluid">
        <Menu />
        <PageHeader>wispy</PageHeader>
        {auth().currentUser ? (
          <div>
            <Dailies />
            <Canvas />
            <Logout />
          </div>
        ) : (
          <LoginLoading />
        )}
        <h2>
          Under active development; Last updated: {gitDate.toLocaleString()}{' '}
          <br />
          Source: <a>{'https://github.com/jaydh/wispy'}</a>
        </h2>
      </div>
    );
  }
}

export default App;
