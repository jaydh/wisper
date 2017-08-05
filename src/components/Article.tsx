import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
import { Button, Collapse } from 'react-bootstrap';

interface Props {
  id: string;
  completed: boolean;
  link: string;
  metadata?: any;
  dateAdded: string;
  onClick(): any;
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
    const { onClick, id, completed, link, dateAdded, metadata } = this.props;
    return (
      <div>
        <Button
          onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
        >
          More
        </Button>
        <a href={link}>
          {' '}{(metadata && (metadata.title || metadata.ogTitle))
            ? metadata.title || metadata.ogTitle
            : link}
        </a>
        <Collapse in={this.state.isMenuOpen}>
          <div>
            {metadata && (metadata.Description || metadata.ogDescription) ?
              ('Description :' + metadata.ogDescription) : ''}
            Date added:{dateAdded} <br />
            Status: {completed.toString()} <br />
            <button
              className="btn"
              onClick={onClick}
              style={{ textDecoration: completed ? 'underline' : 'none' }}
            >
              toggleRead
            </button>
            <AddArticleToProject articleHash={id} />
            <DeleteArticle articleHash={id} />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default Article;
