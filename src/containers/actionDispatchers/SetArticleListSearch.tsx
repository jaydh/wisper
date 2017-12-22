import * as React from 'react';
import { connect } from 'react-redux';
import { setArticleListSearch } from '../../actions/ui/articleList';
import {
  Form,
  InputGroup,
  FormGroup,
  FormControl,
  Glyphicon
} from 'react-bootstrap';
import { ArticleList } from '../../constants/StoreState';

interface State {
  value: string;
}
interface Props {
  onChange: (t: string) => void;
  id: string;
  search: string;
}

class AddArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    const { onChange } = this.props;

    this.setState({
      value: e.target.value
    });
    onChange(e.target.value);
  }

  render() {
    return (
      <Form inline={true} onSubmit={event => event.preventDefault()}>
        <FormGroup controlId="formBasicText" type="text">
          <InputGroup bsSize="small">
            <FormControl
              value={this.state.value}
              placeholder={
                this.state.value === '' ? 'Search' : this.state.value
              }
              onChange={event => this.handleChange(event)}
            />
            <InputGroup.Addon>
              <Glyphicon glyph="search" />
            </InputGroup.Addon>
          </InputGroup>
          <FormControl.Feedback />
        </FormGroup>
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onChange: (search: string) => {
      dispatch(setArticleListSearch(ownProps.id, search));
    }
  };
};

const mapStatetoProps = (state: any, ownProps: any) => {
  return {
    search: state
      .get('articleLists')
      .find((list: ArticleList) => list.id === ownProps.id).search
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(AddArticle);
