import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
import ToggleArticle from '../containers/ToggleArticle';
import { Button, Collapse } from 'react-bootstrap';

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
      <div>
        <Button
          onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
        >
          More
        </Button>
        <a href={link} target="_blank">
          {' '}{metadata && (metadata.title || metadata.ogTitle)
            ? metadata.title || metadata.ogTitle
            : link}
        </a>
        <Collapse in={this.state.isMenuOpen}>
          <div>
            {fetching ? metadata : 'Fetching metadata'}
            Date added:{dateAdded} <br />
            Status: {completed.toString()} <br />
            <ToggleArticle id={id} />
            <AddArticleToProject id={id} />
            <DeleteArticle id={id} />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default Article;
