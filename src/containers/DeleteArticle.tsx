import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../actions/deleteArticle';

export interface Props {
  onDeleteClick: any;
}

class DeleteArticle extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            onDeleteClick();
          }}
        >
          delete
        </button>
      </div>
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
