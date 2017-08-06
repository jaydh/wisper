import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { StoreState } from '../constants/StoreState';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import { ListenToFirebase } from '../actions/syncArticles';
// import { List } from 'immutable';
// import { Article as articleType } from '../constants/StoreState';

const getVisibleArticles = (state: StoreState, listId: number) => {
  const { articles, visibilityFilter, projectFilter } = state;
  let articlesInProject;
  const currentFilter = projectFilter.get(listId);
  switch (currentFilter) {
    case 'ALL':
      articlesInProject = articles;
      break;
    case 'NONE':
      articlesInProject = articles.filter(article => {
        if (article) {
          const projects = article.projects;
          if (projects) {
            return false;
          }
        }
        return false;
      });
      break;
    default:
      articlesInProject = articles.filter(article => {
        if (article) {
          const projects = article.projects;
          if (projects) {
            return Object.keys(article.projects)
              .map(key => projects[key])
              .indexOf(currentFilter) > -1;
          }
        }
        return false;
      });
  }

  switch (visibilityFilter) {
    case 'SHOW_ALL':
      return articlesInProject;
    case 'SHOW_COMPLETED':
      return articlesInProject.filter(t => {
        return t ? t.completed : false;
      });
    case 'SHOW_ACTIVE':
      return articlesInProject.filter(t => {
        return t ? !t.completed : false;
      });
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
};

function mapStateToProps(state: StoreState, ownProps: any) {
  return {
    articles: getVisibleArticles(state, ownProps.id),
  };
}

const mapDispatchToProps = {
  ListenToFirebase,
  onArticleClick: toggleArticleRead
};

const VisibleArticleList = connect(mapStateToProps, mapDispatchToProps)(
  ArticleList
);

export default VisibleArticleList;
