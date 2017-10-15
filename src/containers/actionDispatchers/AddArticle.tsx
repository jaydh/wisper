import * as React from 'react';
import { connect } from 'react-redux';
import addArticle from '../../actions/articles/addArticle';
import {
  InputGroup,
  Button,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { Set, fromJS, Map } from 'immutable';

const options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

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

  parseUri(str: string) {
    let o = options,
      m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str) as object,
      uri = {},
      i = 14;

    while (i--) {
      uri[o.key[i]] = m[i] || '';
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function($0: any, $1: any, $2: any) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });
    return uri;
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

  handleChange(e: any) {
    e.preventDefault();
    this.setState(
      {
        value: e.target.value,
        parse: this.parseUri(e.target.value)
      },
      () => this.getSuggestion()
    );
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
          <ControlLabel>Add article</ControlLabel>

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
