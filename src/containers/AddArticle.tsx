import * as React from 'react';
import { connect } from 'react-redux';
import { addArticle } from '../actions/addArticle';
import { ArticleList } from '../constants/StoreState';
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap';

interface State {
  value: string;
}
interface Props {
  filters: ArticleList;
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
    // Checks if valid hyperlink
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (this.state.value === '') {
      return undefined;
    } else if (regexp.test(this.state.value)) {
      return 'success';
    } else if (!regexp.test(this.state.value)) {
      return 'warning';
    } else if (!this.state.value) {
      return 'error';
    }
    return undefined;
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState({ value: e.target.value });
  }

  render() {
    const { dispatch, filters } = this.props;
    const { projectFilter } = filters;
    const project =
      projectFilter !== 'NONE' && projectFilter !== 'ALL'
        ? projectFilter
        : undefined;

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
            placeholder="Enter link"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Enter valid hyperlink</HelpBlock>
        </FormGroup>
        <Button
          type="button"
          onClick={() => {
            dispatch(addArticle(this.state.value, project));
          }}
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

const mapStateToProps = (state: any, ownProps: { filters: ArticleList }) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
