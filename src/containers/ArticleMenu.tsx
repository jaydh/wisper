import * as React from 'react';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import { ButtonGroup } from 'reactstrap';
interface Props {
  id: string;
}
export default class ArticleMenu extends React.Component<Props> {
  render() {
    const { id } = this.props;
    return (
      <ButtonGroup size="sm">
        <ToggleArticle id={id} />
        <DeleteArticle id={id} />
      </ButtonGroup>
    );
  }
}