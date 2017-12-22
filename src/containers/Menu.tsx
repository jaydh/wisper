import * as React from 'react';
import setUIView from '../actions/ui/setUIView';
import { MenuItem, NavDropdown, Navbar, NavItem, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import logout from '../helpers/firebaseLogout';
interface Props {
  onSetUIView: (t: string) => void;
  view: string;
  user: string;
}
interface OwnProps {
  user: string;
}
class Menu extends React.Component<Props> {
  render() {
    const active = (() => {
      switch (this.props.view) {
        case 'dailies':
          return 1;
        case 'compact':
          return 2;
        case 'canvas':
          return 3;
        case 'analytics':
          return 4;
        case 'Full':
          return 5;
        default:
          return 0;
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
              onClick={() => this.props.onSetUIView('dailies')}
            >
              Dailies{' '}
            </NavItem>
            <NavItem
              eventKey={2}
              onClick={() => this.props.onSetUIView('compact')}
            >
              Compact{' '}
            </NavItem>
            <NavItem
              eventKey={3}
              onClick={() => this.props.onSetUIView('canvas')}
            >
              Canvas{' '}
            </NavItem>
            <NavItem
              eventKey={4}
              onClick={() => this.props.onSetUIView('analytics')}
            >
              Analytics{' '}
            </NavItem>
            <NavItem
              eventKey={5}
              onClick={() => this.props.onSetUIView('full')}
            >
              Full View
            </NavItem>
          </Nav>
          <Nav pullRight={true}>
            <NavDropdown
              title={this.props.user ? this.props.user : 'Demo'}
              id="user-dropdown"
            >
              <MenuItem onClick={() => this.props.onSetUIView('User')}>
                User menu
              </MenuItem>
              <MenuItem onClick={() => logout()}> Logout</MenuItem>
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

const mapStateToProps = (state: any, ownProps: OwnProps) => {
  return {
    view: state.get('ui').view
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
