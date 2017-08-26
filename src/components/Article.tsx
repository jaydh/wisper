import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
import ToggleArticle from '../containers/ToggleArticle';
import { Glyphicon, Button, Collapse, ListGroupItem } from 'react-bootstrap';
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
        <span>
          <ToggleArticle id={id} />
          <Button
            bsStyle="more"
            bsSize="xsmall"
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
          >
            <Glyphicon glyph="menu-hamburger" />
          </Button>
          <Button
            bsStyle="more"
            bsSize="xsmall"
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
          >
            <Glyphicon glyph="option-vertical" />
          </Button>
          <a href={link} target="_blank">
            {metadata && (metadata.title || metadata.ogTitle)
              ? metadata.ogTitle || metadata.title
              : link}
          </a>
        </span>
        <Collapse in={this.state.isMenuOpen}>
          <div>
            {/*add filtering inside this map*/}
            {!fetching && metadata
              ? fromJS(metadata).keySeq().map((t: string) => {
                  return (
                    <p
                      key={t}
                      style={{ fontSize: '.9em' }}
                    >
                      {t}: {fromJS(metadata).get(t)} <br />
                    </p>
                  );
                })
              : 'Fetching metadata'}
            Date added:{dateAdded} <br />
            <AddArticleToProject id={id} />
            <DeleteArticle id={id} />
          </div>
        </Collapse>
      </ListGroupItem>
    );
  }
}

export default Article;
