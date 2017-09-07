import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
import ToggleArticle from '../containers/ToggleArticle';
import {
  Glyphicon,
  Button,
  ButtonGroup,
  Collapse,
  ListGroupItem
} from 'react-bootstrap';
import { fromJS } from 'immutable';

interface Props {
  id: string;
  completed: boolean;
  link: string;
  metadata?: any;
  dateAdded: string;
  dateRead?: string;
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
    const {
      id,
      completed,
      link,
      dateAdded,
      dateRead,
      metadata,
      fetching
    } = this.props;
    const visibleMeta = fromJS([
      'ogTitle',
      'title',
      'ogSiteName',
      'ogDescription',
      'description'
    ]);
    return (
      <ListGroupItem bsStyle={completed ? 'success' : 'info'}>
        {
          // Todo: add onclick for updating lastread}
        }
        <ButtonGroup bsStyle="article">
          <ToggleArticle id={id} />
          <Button
            bsStyle="more"
            bsSize="xsmall"
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
          >
            <Glyphicon glyph="menu-hamburger" />
          </Button>
        </ButtonGroup>

        {fetching && <Glyphicon glyph="refresh" />}
        <a
          className="article-link"
          href={link}
          target="_blank"
          style={{ display: 'inline-block', width: '70%' }}
        >
          {metadata && (metadata.title || metadata.ogTitle) ? (
            metadata.ogTitle || metadata.title
          ) : (
            link
          )}
        </a>

        <Collapse in={this.state.isMenuOpen}>
          <div>
            <h5>
              Date added: {dateAdded} <br />
              {dateRead ? 'Date Read: ' + dateRead : ' '}
            </h5>
            {!fetching && metadata ? (
              fromJS(metadata)
                .keySeq()
                .filter((t: string) => visibleMeta.includes(t))
                .map((t: string) => {
                  return (
                    <h5 key={t} style={{ fontSize: '.9em' }}>
                      {t}: {fromJS(metadata).get(t)} <br />
                    </h5>
                  );
                })
            ) : (
              'Fetching metadata'
            )}
            <AddArticleToProject id={id} />
            <DeleteArticle id={id} />
          </div>
        </Collapse>
      </ListGroupItem>
    );
  }
}

export default Article;
