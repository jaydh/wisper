import * as React from 'react';
import AddArticle from '../containers/AddArticle';
import VisibleArticleList from '../containers/VisibleArticleList';
import Logout from './Logout';

class App extends React.Component {

    public render() {

        return (
            <div className="container" >
                <div className="page-header">
                    <h1>wispy</h1>
                </div>
                <div className="jumbotron">
                    <AddArticle />
                    <VisibleArticleList />
                </div>
                <Logout />
            </div >
        );
    }
}

export default App;