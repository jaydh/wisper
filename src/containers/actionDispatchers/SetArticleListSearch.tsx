import * as React from 'react';
import { connect } from 'react-redux';
import { setArticleListSearch } from '../../actions/ui/articleList';
import { Form, Input, FormGroup, FormFeedback } from 'reactstrap';

interface State {
  value: string;
}
interface Props {
  onChange: (t: string) => void;
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
        <FormGroup type="text">
          <Input
            placeholder={this.state.value === '' ? 'Search' : this.state.value}
            onChange={event => this.handleChange(event)}
          />
          <FormFeedback />
        </FormGroup>
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onChange: (search: string) => {
      dispatch(setArticleListSearch(search));
    }
  };
};

const mapStatetoProps = (state: any, ownProps: any) => {
  return {
    search: state.get('articleLists').search
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(AddArticle);
