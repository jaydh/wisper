import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { StoreState } from '../constants/StoreState';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import { ListenToFirebase } from '../actions/syncArticles';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';

const getArticlesWithProject = (
  articles: List<articleType>,
  filter: String
): List<articleType> => {
  let articlesInProject: List<articleType>;
  switch (filter) {
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
      }) as List<articleType>;
      break;
    default:
      articlesInProject = articles.filter(article => {
        if (article) {
          const projects = article.projects;
          if (projects) {
            // would love ES2017 object values here
            return (
              Object.keys(article.projects)
                .map(key => projects[key])
                .indexOf(filter) > -1
            );
          }
        }
        return false;
      }) as List<articleType>;
  }
  return articlesInProject;
};

const getVisibleArticles = (
  state: StoreState,
  listId: number
): List<articleType> => {
  const { articles, visibilityFilter, projectFilter } = state;
  const articlesInProject = getArticlesWithProject(
    articles,
    projectFilter.get(listId)
  );
  switch (visibilityFilter) {
    case 'SHOW_ALL':
      return articlesInProject;
    case 'SHOW_COMPLETED':
      return articlesInProject.filter(t => {
        return t ? t.completed : false;
      }) as List<articleType>;
    case 'SHOW_ACTIVE':
      return articlesInProject.filter(t => {
        return t ? !t.completed : false;
      }) as List<articleType>;
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
};

function mapStateToProps(state: StoreState, ownProps: any) {
  return {
    articles: getVisibleArticles(state, ownProps.id)
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
