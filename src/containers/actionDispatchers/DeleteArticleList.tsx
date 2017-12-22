import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticleList } from '../../actions/ui/articleList';
import { Button, Glyphicon } from 'react-bootstrap';

export interface Props {
  onDeleteClick: () => void;
}

class DeleteArticleList extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <Button bsSize="small" onClick={() => onDeleteClick()}>
        <Glyphicon glyph="remove" />
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
