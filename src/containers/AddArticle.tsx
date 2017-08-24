import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { addArticle } from '../actions/addArticle';
import { ArticleList } from '../constants/StoreState';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

interface State {
  value: string;
}
interface Props {
  articleList: ArticleList;
  dispatch: Dispatch<AddArticle>;
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

  handleSubmit(project: string) {
    const { dispatch } = this.props;
    if (this.getValidationState() === 'success') {
      dispatch(addArticle(this.state.value, project));
    } else {
      alert('Please enter valid link');
    }
  }

  render() {
    const { articleList: { projectFilter } } = this.props;
    const project =
      projectFilter !== 'NONE' && projectFilter !== 'ALL'
        ? projectFilter
        : '';

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          this.handleSubmit(project);
        }}
      >
        <FormGroup
          controlId="formBasicText"
          type="text"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Add article</ControlLabel>
          <FormControl
            value={this.state.value}
            placeholder="Enter link"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Button
          type="button"
          bsStyle="submit"
          onClick={() => {
            this.handleSubmit(project);
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

const mapStateToProps = (
  state: any,
  ownProps: { articleList: ArticleList }
) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
