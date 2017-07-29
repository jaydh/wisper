import * as React from 'react';
import AddArticle from '../containers/AddArticle';
import VisibleArticleList from '../containers/VisibleArticleList';
import Footer from './Footer';

class App extends React.Component {

    public render() {
       
        return (
            <div className="container-fluid" >
                <AddArticle />
                <VisibleArticleList />
                <Footer />
            </div >
        );
    }
}

export default App;