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
        <ButtonGroup
          style={{
            position: 'absolute',
            right: '1em',
            width: '5em',
            height: '5em'
          }}
        >
          <ToggleArticle id={id} />
          <Button
            bsStyle="more"
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
          <div className="articleInfo">
            <p>
              Date added: {dateAdded} <br />
              {dateRead ? 'Date Read: ' + dateRead : ' '}
            </p>
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
