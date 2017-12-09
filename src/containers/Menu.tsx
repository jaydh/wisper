import * as React from 'react';
import Logout from '../components/Logout';
import setUIView from '../actions/setUIView';
import { NavDropdown, Navbar, NavItem, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
interface Props {
  onSetUIView: (t: string) => void;
  view: string;
}

class Menu extends React.Component<Props> {
  render() {
    const active = (() => {
      switch (this.props.view) {
        case 'Dailies':
          return 1;
        case 'Compact':
          return 2;
        case 'Canvas':
          return 3;
        case 'Analytics':
          return 4;
        case 'Full':
          return 5;
        default:
          return 1;
      }
    })();
    return (
      <Navbar collapseOnSelect={true}>
        <Navbar.Header>
          <Navbar.Brand>Wispy</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav bsStyle={'tabs'} activeKey={active}>
            <NavItem
              eventKey={1}
              onClick={() => this.props.onSetUIView('Dailies')}
            >
              Dailies{' '}
            </NavItem>
            <NavItem
              eventKey={2}
              onClick={() => this.props.onSetUIView('Compact')}
            >
              Compact{' '}
            </NavItem>
            <NavItem
              eventKey={3}
              onClick={() => this.props.onSetUIView('Canvas')}
            >
              Canvas{' '}
            </NavItem>
            <NavItem
              eventKey={4}
              onClick={() => this.props.onSetUIView('Analytics')}
            >
              Analytics{' '}
            </NavItem>
            <NavItem
              eventKey={5}
              onClick={() => this.props.onSetUIView('Full')}
            >
              Full View
            </NavItem>{' '}
          </Nav>
          <Nav pullRight={true}>
            <NavDropdown id="user-dropdown">
              <Logout />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSetUIView: (view: string) => {
      dispatch(setUIView(view));
    }
  };
};

const mapStateToProps = (state: any) => {
  return {
    view: state.get('ui').view
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
