import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';

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
        <li>
          <a href={link}> {
            metadata ?
            (metadata.title || metadata.ogTitle)
            : link
            } </a>
          <br />
            date added:{dateAdded} <br />
            status: {completed.toString()} <br />
            <button
              className="btn"
              onClick={onClick}
              style={{ textDecoration: completed ? 'underline' : 'none' }}
            >
              toggleRead
            </button>
            <AddArticleToProject articleHash={id} />
            <DeleteArticle articleHash={id} />
        </li>
      </div>
    );
  }
}

export default Article;
