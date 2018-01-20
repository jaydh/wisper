import * as React from 'react';
import { connect } from 'react-redux';
import { addArticleList } from '../../actions/ui/articleList';
import { Button } from 'reactstrap';
export interface Props {
  onAddClick: () => void;
}

class AddArticleList extends React.Component<Props, {}> {
  render() {
    const { onAddClick } = this.props;
    return (
      <Button bsStyle="addList" onClick={() => onAddClick()}>
        Articlelist
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
