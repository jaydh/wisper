import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../../actions/articles/deleteArticle';
import setUIView from '../../actions/ui/setUIView';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  articleId: string;
  onDeleteClick: () => void;
  setUIToArticleView: () => void;
}

class DeleteArticle extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick, setUIToArticleView } = this.props;
    return (
      <Button
        onClick={() => {
          onDeleteClick();
          setUIToArticleView();
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
      dispatch(deleteArticle(ownProps.articleId));
    },
    setUIToArticleView: () => {
      dispatch(setUIView('compact'));
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticle);
