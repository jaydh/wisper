import * as React from 'react';
import { connect } from 'react-redux';
import { toggleArticleRead } from '../../actions/articles/toggleArticleRead';
import setCurrentArticle from '../../actions/ui/setCurrentArticle';
import setUIView from '../../actions/ui/setUIView';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';
import { Article } from '../../constants/StoreState';

export interface Props {
  onToggleClick: (toBeCompleted: boolean) => void;
  articleId: string;
  articleCompleted: boolean;
}

class ToggleArticleRead extends React.Component<Props> {
  render() {
    const { onToggleClick, articleCompleted } = this.props;
    return (
      <Button
        onClick={() => {
          onToggleClick(!articleCompleted);
        }}
      >
        <Icon name={articleCompleted ? 'book' : 'check'} />
      </Button>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleCompleted: state
      .get('articles')
      .find((t: Article) => t.id === ownProps.articleId).completed
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onToggleClick: (toBeCompleted: boolean) => {
      dispatch(toggleArticleRead(ownProps.id));
      // Reset article viewer if toggled from bar
      if (toBeCompleted) {
        dispatch(setCurrentArticle());
      }
      dispatch(setUIView);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToggleArticleRead);
