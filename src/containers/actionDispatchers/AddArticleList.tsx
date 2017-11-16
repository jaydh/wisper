import * as React from 'react';
import { connect } from 'react-redux';
import { addArticleList } from '../../actions/articleList';
import { Button } from 'react-bootstrap';
export interface Props {
  onAddClick: () => void;
}

class AddArticleList extends React.Component<Props, {}> {
  render() {
    const { onAddClick } = this.props;
    return (
      <Button bsStyle="addList" bsSize="large" onClick={() => onAddClick()}>
        Add Articlelist
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onAddClick: () => {
      dispatch(addArticleList());
    }
  };
};

export default connect(null, mapDispatchToProps)(AddArticleList);
