import * as React from 'react';
import { connect } from 'react-redux';
import { addArticle } from '../actions/addArticle';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

interface State {
  value: string;
}
interface Props {
  dispatch: any;
}

class AddArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  getValidationState() {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (regexp.test(this.state.value)) {
      return 'success';
    } else if (!regexp.test(this.state.value)) {
      return 'warning';
    } else if (!this.state.value) {
      return 'error';
    }
    return undefined;
  }

  handleChange(e: any) {
    this.setState({ value: e.target.value });
  }

  render() {
    const { dispatch } = this.props;
    return (
      <form onSubmit={() => onclick}>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Add article</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Enter valid hyperlink</HelpBlock>
        </FormGroup>
        <Button
          type="button"
          onClick={

            () => {
              console.log(this.state.value);
              return dispatch(addArticle(this.state.value));

            }
          }
        >
          Submit
        </Button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: dispatch
  };
};

export default connect(null, mapDispatchToProps)(AddArticle);