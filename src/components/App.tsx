import * as React from 'react';
import Canvas from '../containers/Canvas';
import Dailies from '../containers/Dailies';
import Analytics from '../containers/Analytics';
import LoginLoading from './LoginLoading';
import Logout from './Logout';
import { PageHeader, NavItem, Nav } from 'react-bootstrap';
import { auth } from '../firebase';
import '!!style-loader!css-loader!../css/styles.css';
import { push as Menu } from 'react-burger-menu';

interface State {
  gitCommit: string;
  sidebarOpen: boolean;
  show: string;
  showKey: number;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      gitCommit: '',
      sidebarOpen: false,
      show: 'all',
      showKey: 1
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

  changeView(show: string, showKey: number) {
    this.setState({ show, showKey });
  }
  render() {
    return (
      <div className="container-fluid">
        {auth().currentUser && (
          <Menu bsStyle={'pills'} styles={styles} right={true}>
            <Nav activeKey={this.state.showKey}>
              <NavItem eventKey={1} onClick={() => this.changeView('all', 1)}>
                All
              </NavItem>{' '}
              <NavItem
                eventKey={2}
                onClick={() => this.changeView('articles', 2)}
              >
                Articles
              </NavItem>
              <NavItem
                eventKey={3}
                onClick={() => this.changeView('analytics', 2)}
              >
                Analytics
              </NavItem>
            </Nav>
            <div
              style={{
                position: 'absolute',
                bottom: '2em'
              }}
            >
              <Logout />
            </div>
          </Menu>
        )}
        <PageHeader>wispy</PageHeader>
        <div style={{ margin: '0 auto', textAlign: 'center' }}>
          <Dailies />
        </div>
        {auth().currentUser ? (
          <div>
            {(() => {
              switch (this.state.show) {
                case 'articles':
                  return <Canvas />;
                case 'analytics':
                  return <Analytics />;
                default:
                  return (
                    <div>
                      <Canvas /> <Analytics />
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

export default App;

const styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '36px',
    height: '30px',
    right: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};
