import * as React from 'react';
import Logout from '../components/Logout';
import setUIView from '../actions/setUIView';
import { NavItem, Nav } from 'react-bootstrap';
import { push as BurgerMenu } from 'react-burger-menu';
import { connect } from 'react-redux';
const styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '26px',
    height: '20px',
    right: '26px',
    top: '26px'
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

interface Props {
  onSetUIView: (t: string) => void;
}

class Menu extends React.Component<Props> {
  render() {
    return (
      <BurgerMenu
        bsStyle={'pills'}
        styles={styles}
        right={true}
        width={'20rem'}
      >
        <Nav>
          <NavItem onClick={() => this.props.onSetUIView('Full')}>
            Full View
          </NavItem>{' '}
          <NavItem onClick={() => this.props.onSetUIView('Compact')}>
            Compact{' '}
          </NavItem>
          <NavItem onClick={() => this.props.onSetUIView('Canvas')}>
            Canvas{' '}
          </NavItem>
          <NavItem onClick={() => this.props.onSetUIView('Dailies')}>
            Dailies{' '}
          </NavItem>
          <NavItem onClick={() => this.props.onSetUIView('Analytics')}>
            Analytics{' '}
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
      </BurgerMenu>
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

export default connect(null, mapDispatchToProps)(Menu);
