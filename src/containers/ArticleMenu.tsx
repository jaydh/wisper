import * as React from 'react';
import ToggleArticle from './actionDispatchers/ToggleArticle';
import DeleteArticle from './actionDispatchers/DeleteArticle';
import { ButtonGroup, Button, UncontrolledTooltip } from 'reactstrap';
import { Icon } from 'react-fa';
import { Article } from '../constants/StoreState';
import updateHTML from '../actions/articles/updateHTML';
import { connect } from 'react-redux';

interface Props {
  article: Article;
  collapseHandler?: () => void;
  onSaveClick: () => void;
}

class ArticleMenu extends React.Component<Props> {
  render() {
    const { article, collapseHandler, onSaveClick } = this.props;
    return (
      <ButtonGroup size="sm">
        <Button
          id={`save${article.id}`}
          onClick={() => (!article.HTMLContent ? onSaveClick() : null)}
          disabled={article.HTMLContent !== null}
        >
          <Icon name={!article.HTMLContent ? 'save' : 'check'} />
        </Button>
        <Button
          id={`outside${article.id}`}
          onClick={() => window.open(article.link, '_blank')}
        >
          <Icon name="external-link" />
        </Button>
        <ToggleArticle articleId={article.id} />
        <DeleteArticle articleId={article.id} />
        {collapseHandler && (
          <Button onClick={collapseHandler}>
            <Icon name="plus" />
          </Button>
        )}
        <UncontrolledTooltip placement="top" target={`save${article.id}`}>
          {!article.HTMLContent ? <p>Save locally</p> : <p>Read for offline</p>}
        </UncontrolledTooltip>{' '}
        <UncontrolledTooltip placement="top" target={`outside${article.id}`}>
          Go to full website
        </UncontrolledTooltip>
      </ButtonGroup>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onSaveClick: () => dispatch(updateHTML(ownProps.article.id))
  };
};

export default connect(null, mapDispatchToProps)(ArticleMenu);
