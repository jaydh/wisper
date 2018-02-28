import * as React from 'react';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import { ButtonGroup, Button } from 'reactstrap';
import { Icon } from 'react-fa';
import { Article } from '../constants/StoreState';

interface Props {
  article: Article;
  collapseHandler?: () => void;
}

export default class ArticleMenu extends React.Component<Props> {
  render() {
    const { article, collapseHandler } = this.props;
    return (
      <ButtonGroup size="sm">
        <Button onClick={() => window.open(article.link, '_blank')}>
          <Icon name="external-link" />
        </Button>
        <ToggleArticle id={article.id} />
        <DeleteArticle id={article.id} />
        {collapseHandler && (
          <Button onClick={collapseHandler}>
            <Icon name="plus" />
          </Button>
        )}
      </ButtonGroup>
    );
  }
}
