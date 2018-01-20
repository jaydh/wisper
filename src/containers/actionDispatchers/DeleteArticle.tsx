import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../../actions/articles/deleteArticle';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  onDeleteClick: () => void;
}

class DeleteArticle extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <Button
        bsSize="xsmall"
        onClick={() => {
          onDeleteClick();
        }}
      >
        <Icon name="eraser" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: () => {
      dispatch(deleteArticle(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticle);
