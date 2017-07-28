import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { StoreState } from '../constants/StoreState';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import syncArticles from '../actions/syncArticles';
const getVisibleArticles = (state: StoreState) => {
    const { articles, visibilityFilter } = state;
    switch (visibilityFilter) {
        case 'SHOW_ALL':
            return articles;
        case 'SHOW_COMPLETED':
            return articles.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return articles.filter(t => !t.completed);
        default:
            throw new Error('Unknown filter: ' + visibilityFilter);
    }
};

function mapStateToProps(state: StoreState) {
    return { articles: getVisibleArticles(state) };
}

const mapDispatchToProps = {
    syncArticles,
    onArticleClick: toggleArticleRead
};

const VisibleArticleList = connect(mapStateToProps, mapDispatchToProps)(ArticleList);

export default VisibleArticleList;
