import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../actions/deleteArticle';

export interface Props {
  dispatch: any;
  id: string;
}

class DeleteArticle extends React.Component<Props, {}> {
  render() {
    const { dispatch, id } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => dispatch(deleteArticle(id))}
        >
          delete
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    id: ownProps.id
  };
};

export default connect(mapStateToProps)(DeleteArticle);
