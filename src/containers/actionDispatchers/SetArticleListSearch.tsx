import * as React from 'react';
import { connect } from 'react-redux';
import { setArticleListSearch } from '../../actions/articleList';
import { InputGroup, FormGroup, FormControl } from 'react-bootstrap';
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
      <form onSubmit={event => event.preventDefault()}>
        <FormGroup controlId="formBasicText" type="text">
          <InputGroup bsSize="medium">
            <FormControl
              value={this.state.value}
              placeholder={
                this.state.value === '' ? 'Search' : this.state.value
              }
              onChange={event => this.handleChange(event)}
            />
          </InputGroup>
          <FormControl.Feedback />
        </FormGroup>
      </form>
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
