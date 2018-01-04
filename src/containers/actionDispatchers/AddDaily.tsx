import * as React from 'react';
import { connect } from 'react-redux';
import addDaily from '../../actions/dailies/addDaily';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

interface Props {
  onAddDaily: (t: string) => void;
}

interface State {
  value: string;
}

class AddDaily extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
  }

  render() {
    const { onAddDaily } = this.props;
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          onAddDaily(this.state.value);
        }}
      >
        <FormGroup controlId="formBasicText" type="text">
          <InputGroup bsSize="sm">
            <FormControl
              value={this.state.value}
              placeholder="Add Daily"
              onChange={this.handleChange}
            />
            <InputGroup.Button>
              <Button
                bsStyle="submit"
                onClick={() => onAddDaily(this.state.value)}
              >
                Submit
              </Button>
            </InputGroup.Button>
          </InputGroup>
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddDaily: (daily: string) => {
      dispatch(addDaily(daily));
    }
  };
};

export default connect(null, mapDispatchToProps)(AddDaily);
