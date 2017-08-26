import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticleList } from '../actions/articleList';

export interface Props {
  onDeleteClick: any;
}

class DeleteArticleList extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <button
        type="button"
        onClick={() => onDeleteClick()}
        className="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
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
