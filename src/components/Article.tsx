import * as React from "react";
import AddArticleToProject from '../containers/AddArticleToProject'
import DeleteArticle from '../containers/DeleteArticle'

export interface props {
    onClick(): any,
    id: string,
    completed: boolean,
    link: string,
    author?: string,
    title?: string,
    domain?: string,
    dateAdded: string
}

class Article extends React.Component<props, {}> {
    render() {
        const { onClick, id, completed, link, dateAdded, title } = this.props;
        return (
            <div>
                <li
                    onClick={onClick}
                    style={{
                        textDecoration: completed ? 'underline' : 'none'
                    }}
                >
                    toggleRead
            </li>
                <p>
                    <a href={link}> {title}</a> <br />
                    date added:{

                        dateAdded} <br />
                </p>
                <AddArticleToProject articleHash={id} />
                <DeleteArticle articleHash={id} />
            </div>
        );
    }

}

export default Article;
