import { push as Menu } from 'react-burger-menu';
import addDaily from '../actions/dailies/addDaily';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import AddArticleList from '../containers/actionDispatchers/AddArticleList';
import * as React from 'react';
import { connect } from 'react-redux';

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

interface Props {
  AddDaily: (daily: string) => void;
}

interface State {
  dailyValue: string;
}

class Hamburger extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { dailyValue: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: any) {
    e.preventDefault();
    this.setState({ dailyValue: e.target.value });
  }

  render() {
    const { AddDaily } = this.props;
    return (
      <Menu styles={styles} right={true}>
        <Form
          inline={true}
          onSubmit={event => {
            event.preventDefault();
            AddDaily(this.state.dailyValue);
            this.setState({ dailyValue: '' });
          }}
        >
          <FormGroup controlId="formBasicText">
            <FormControl
              type="text"
              value={this.state.dailyValue}
              placeholder="Add daily"
              onChange={this.handleChange}
            />
          </FormGroup>
        </Form>

        <AddArticleList />
      </Menu>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    AddDaily: (daily: string) => {
      dispatch(addDaily(daily));
    }
  };
};

export default connect(null, mapDispatchToProps)(Hamburger);
