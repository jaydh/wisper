import * as React from 'react';
import AddArticle from '../containers/AddArticle';
import VisibleArticleList from '../containers/VisibleArticleList';
import Footer from './Footer';

class App extends React.Component {

    public render() {

        return (
            <div className="container" >
                <div className="page-header">
                    <h1>wisper</h1>
                </div>
                <div className="jumbotron">
                    <AddArticle />
                    <VisibleArticleList />
                    <Footer />
                </div>
            </div >
        );
    }
}

export default App;