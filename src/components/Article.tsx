import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
import ToggleArticle from '../containers/ToggleArticle';
import { Button, Collapse, ListGroupItem } from 'react-bootstrap';
import { fromJS } from 'immutable';

interface Props {
  id: string;
  completed: boolean;
  link: string;
  metadata?: any;
  dateAdded: string;
  fetching?: boolean;
}
interface State {
  isMenuOpen: boolean;
}

class Article extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  render() {
    const { id, completed, link, dateAdded, metadata, fetching } = this.props;
    return (
      <ListGroupItem bsStyle={completed ? 'success' : 'info'}>
        {
          // Todo: add onclick for updating lastread}
        }
        <a href={link} target="_blank">
          {metadata && (metadata.title || metadata.ogTitle)
            ? metadata.ogTitle || metadata.title
            : link}
        </a>{' '}
        {' '}
        <Button
          bsStyle="more"
          onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
        >
          {
            // placeholder for SVG
            ''
          }
        </Button>
        <Collapse in={this.state.isMenuOpen}>
          <div>
            {!fetching && metadata ? fromJS(metadata) : 'Fetching metadata'}
            Date added:{dateAdded} <br />
            Status: {completed.toString()} <br />
            <ToggleArticle id={id} />
            <AddArticleToProject id={id} />
            <DeleteArticle id={id} />
          </div>
        </Collapse>
      </ListGroupItem>
    );
  }
}

export default Article;
