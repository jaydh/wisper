import * as React from 'react';
import { connect } from 'react-redux';
import addArticle from '../../actions/articles/addArticle';
import { InputGroup, Button, FormGroup, FormControl } from 'react-bootstrap';
import { List, fromJS, Map } from 'immutable';
import parseUri from '../../helpers/parseURI';
import { Project } from '../../constants/StoreState';

interface State {
  value: string;
  parse: any;
  suggestion: string;
}
interface Props {
  onAdd: (t: string, p?: string) => void;
  projects: List<Project>;
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
    const { projects } = this.props;
    const separators = [' ', '.', '+', '(', ')', '*', '\\/', ':', '?', '-'];
    const paths = fromJS(
      (this.state.parse.path + ' ' + this.state.parse.authority).split(
        new RegExp('[' + separators.join('') + ']', 'g')
      )
    ).toSet();
    const queries = fromJS(this.state.parse.queryKey).valueSeq();

    let counts = Map<string, number>();
    projects.forEach((t: Project) => {
      const dictionary = t.dictionary;
      paths.union(queries).forEach((p: string) => {
        if (p === t.id) {
          this.setState({
            suggestion: p
          });
          return false;
        }
        if (dictionary.includes(p.toLocaleLowerCase())) {
          counts = counts.update(t.id, (count: number = 0) => count + 1);
        }
        return true;
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
      projectFilter !== 'None' && projectFilter !== 'All Projects'
        ? projectFilter
        : '';
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
          <InputGroup bsSize="large">
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
          (projectFilter === 'All Projects' || projectFilter === 'None') &&
          this.state.suggestion && (
            <Button onClick={() => this.handleSubmit(true)}>
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
    projects: state.get('projects')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
