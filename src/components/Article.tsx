import * as React from 'react';
import AddArticleToProject from '../containers/AddArticleToProject';
import DeleteArticle from '../containers/DeleteArticle';
var { DropdownMenu } = require('react-dd-menu');

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

    toggle = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    close = () => {
        this.setState({ isMenuOpen: false });
    }

    click = () => {
        console.log('You clicked an item');
    }

    render() {
        const { onClick, id, completed, link, dateAdded, title } = this.props;
        let menuOptions = {
            isOpen: this.state.isMenuOpen,
            close: this.close.bind(this),
            size: 'sm',
            toggle: <button className="btn-info btn-sm" type="button" onClick={this.toggle.bind(this)}>more</button>,
            align: 'right',
        };

        return (
            <div>
                <li>
                    <a href={link}> {title}</a> <br />

                    <DropdownMenu {...menuOptions}>
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
                    </DropdownMenu>
                </li >
            </div >
        );
    }
}

export default Article;
