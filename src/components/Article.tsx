import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';

interface Props {
    id: string;
    completed: boolean;
    link: string;
    author?: string;
    title?: string;
    domain?: string;
    dateAdded: string;
    onClick(): any;
}

class Article extends React.Component<Props> {
    render() {
        const { onClick, id, completed, link, dateAdded, title } = this.props;
        return (
            <div>
                <li>
                    <p>
                        <a href={link}> {title}</a> <br />
                        <button
                            className="btn"
                            onClick={onClick}
                            style={{ textDecoration: completed ? 'underline' : 'none' }}
                        >
                            toggleRead
                        </button>
                        date added:{dateAdded} <br />
                    </p>

                    <AddArticleToProject articleHash={id} />
                    <DeleteArticle articleHash={id} />
                </li >
            </div >
        );
    }
}

export default Article;
