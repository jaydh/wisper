import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../actions/deleteArticle';
import { Button, Glyphicon } from 'react-bootstrap';

export interface Props {
  onDeleteClick: () => void;
}

class DeleteArticle extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          style={{
            position: 'absolute',
            right: '.2em',
            bottom: '.2em'
          }}
          onClick={() => {
            onDeleteClick();
          }}
        >
          <Glyphicon glyph="remove" />
        </Button>
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
