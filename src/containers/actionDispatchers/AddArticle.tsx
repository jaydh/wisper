import * as React from 'react';
import { connect } from 'react-redux';
import addArticle from '../../actions/articles/addArticle';
import { InputGroup, Button, FormGroup, FormControl } from 'react-bootstrap';
import { Set, fromJS, Map } from 'immutable';
import parseUri from '../../helpers/parseURI';

interface State {
  value: string;
  parse: any;
  suggestion: string;
}
interface Props {
  onAdd: (t: string, p?: string) => void;
  wordbanks: Map<string, Set<string>>;
  projectFilter: string;
}

class AddArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      parse: '',
      suggestion: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState(
      {
        value: e.target.value,
        parse: parseUri(e.target.value)
      },
      () => this.getSuggestion()
    );
  }

  getValidationState() {
    // Checks if valid hyperlink
    if (this.state.parse.authority === '' || this.state.parse.protocol === '') {
      return 'warning';
    } else if (this.state.parse.authority && this.state.parse.protocol) {
      return 'success';
    } else if (this.state.parse === '') {
      return undefined;
    } else if (!this.state.parse) {
      return 'error';
    }
    return undefined;
  }

  getSuggestion() {
    const { wordbanks } = this.props;
    const separators = [' ', '.', '+', '(', ')', '*', '\\/', ':', '?', '-'];
    const paths = fromJS(
      (this.state.parse.path + ' ' + this.state.parse.authority).split(
        new RegExp('[' + separators.join('') + ']', 'g')
      )
    ).toSet();
    const queries = fromJS(this.state.parse.queryKey).valueSeq();

    let counts = Map<string, number>();
    wordbanks.keySeq().forEach((t: string) => {
      paths.union(queries).forEach((p: string) => {
        if (p === t) {
          this.setState({
            suggestion: p
          });
          return;
        }
        if (wordbanks.get(t).includes(p.toLocaleLowerCase())) {
          counts = counts.update(t, (count: number = 0) => count + 1);
        }
      });
    });
    const max = Math.max(...counts.valueSeq().toJS());
    this.setState({
      suggestion: counts.findKey((count: number) => count === max)
    });
  }
  handleSubmit(useSuggest: boolean) {
    const { onAdd, projectFilter } = this.props;
    let project =
      projectFilter !== 'None' && projectFilter !== 'All' ? projectFilter : '';
    project = useSuggest ? this.state.suggestion : project;

    if (this.getValidationState() === 'success') {
      onAdd(this.state.parse.source, project);
      this.setState({ parse: '', value: '' });
    } else {
      alert('Please enter valid link');
    }
  }

  render() {
    const { projectFilter } = this.props;
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          this.handleSubmit(false);
        }}
      >
        <FormGroup
          controlId="formBasicText"
          type="text"
          validationState={this.getValidationState()}
        >
          <InputGroup bsSize="medium">
            <InputGroup.Button>
              <Button bsStyle="submit" onClick={() => this.handleSubmit(false)}>
                Submit
              </Button>
            </InputGroup.Button>
            <FormControl
              value={this.state.value}
              placeholder="Enter link"
              onChange={this.handleChange}
            />
          </InputGroup>
          <FormControl.Feedback />
        </FormGroup>
        {this.getValidationState() === 'success' &&
          (projectFilter === 'All' || projectFilter === 'None') &&
          this.state.suggestion && (
            <Button bsSize="large" onClick={() => this.handleSubmit(true)}>
              Add to {this.state.suggestion} project?
            </Button>
          )}
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAdd: (link: string, project?: string) => {
      dispatch(addArticle(link, project));
    }
  };
};

const mapStateToProps = (state: any, ownProps: { projectFilter: string }) => {
  return {
    wordbanks: state.get('projects')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
