import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticleList } from '../../actions/ui/articleList';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  onDeleteClick: () => void;
}

class DeleteArticleList extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <Button onClick={() => onDeleteClick()}>
        <Icon name="remove" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: () => {
      dispatch(deleteArticleList(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticleList);
