import * as React from 'react';
import { connect } from 'react-redux';
import addArticle from '../../actions/articles/addArticle';
import {
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Form,
  Input,
  Button,
  FormGroup
} from 'reactstrap';
import { List, fromJS, Map } from 'immutable';
import parseUri from '../../helpers/parseURI';
import { Project } from '../../constants/StoreState';

interface State {
  value: string;
  parse: any;
  suggestion: string;
  projectSelectorOpen: boolean;
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
      suggestion: '',
      projectSelectorOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.projectSelectorToggle = this.projectSelectorToggle.bind(this);
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
      return false;
    } else if (this.state.parse.authority && this.state.parse.protocol) {
      return true;
    } else if (this.state.parse === '') {
      return undefined;
    } else if (!this.state.parse) {
      return false;
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
  handleSubmit(useSuggest: boolean = false, project?: string) {
    const { onAdd, projectFilter } = this.props;
    project =
      project || projectFilter === 'None' || projectFilter === 'All Projects'
        ? project
        : projectFilter;
    project = useSuggest ? this.state.suggestion : project;

    if (this.getValidationState()) {
      onAdd(this.state.parse.source, project);
      this.setState({ parse: '', value: '' });
    } else {
      alert('Please enter valid link');
    }
  }
  projectSelectorToggle() {
    this.setState({ projectSelectorOpen: !this.state.projectSelectorOpen });
  }

  render() {
    const { projectFilter, projects } = this.props;
    return (
      <Form
        inline={true}
        onSubmit={event => {
          event.preventDefault();
          this.handleSubmit(false);
        }}
      >
        <FormGroup type="url">
          <Input
            value={this.state.value}
            onChange={this.handleChange}
            type="url"
            valid={this.getValidationState()}
            placeholder="Enter link"
          />{' '}
          <ButtonGroup>
            <Button onClick={() => this.handleSubmit(false)}>Submit</Button>
            <ButtonDropdown
              isOpen={this.state.projectSelectorOpen}
              toggle={this.projectSelectorToggle}
            >
              <DropdownToggle caret={true} />
              <DropdownMenu>
                {projects.map((t: Project) => (
                  <DropdownItem
                    key={t.id + 'dropdownSubmit'}
                    onClick={() => this.handleSubmit(false, t.id)}
                  >
                    Submit to {t.id}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
            {this.getValidationState() &&
              (projectFilter === 'All Projects' || projectFilter === 'None') &&
              this.state.suggestion && (
                <Button onClick={() => this.handleSubmit(true)}>
                  Suggestion: Add to {this.state.suggestion} project?
                </Button>
              )}
          </ButtonGroup>
        </FormGroup>
      </Form>
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
