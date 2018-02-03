import * as React from 'react';
import setUIView from '../actions/ui/setUIView';
import { connect } from 'react-redux';
import {
  Nav,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavbarBrand,
  NavLink,
  NavbarToggler,
  NavItem,
  Navbar,
  Collapse
} from 'reactstrap';
import logout from '../helpers/firebaseLogout';
interface Props {
  onSetUIView: (t: string) => void;
  view: string;
  user: string;
}
interface OwnProps {
  user: string;
}
interface State {
  isOpen: boolean;
}
class Menu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Navbar color="faded" light={true} expand="sm">
        <NavbarBrand>Wispy</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
          <Nav className="ml-auto" tabs={true} navbar={true}>
            <NavItem>
              <NavLink
                active={this.props.view === 'dailies'}
                onClick={() => {
                  this.props.onSetUIView('dailies');
                  this.toggle();
                }}
              >
                Dailies
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={this.props.view === 'compact'}
                onClick={() => {
                  this.props.onSetUIView('compact');
                  this.toggle();
                }}
              >
                Articles
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={this.props.view === 'analytics'}
                onClick={() => {
                  this.props.onSetUIView('analytics');
                  this.toggle();
                }}
              >
                Analytics
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav={true}>
              <DropdownToggle caret={true}>
                {this.props.user ? this.props.user : 'Demo'}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    this.props.onSetUIView('User');
                    this.toggle();
                  }}
                >
                  User menu
                </DropdownItem>
                <DropdownItem onClick={() => logout()}> Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
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
