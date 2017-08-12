import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import { List } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
// error when typing articleInProj with List<articleType>;

const getArticlesWithProject = (
  articles: List<articleType>,
  projectFilter: string) => {

  let articlesInProject;
  switch (projectFilter) {
    case 'ALL':
      articlesInProject = articles;
      break;
    case 'NONE':
      articlesInProject = articles.filter(article => {
        if (article) {
          const projects = article.projects;
          if (!projects) {
            return true;
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
            return (
              Object.keys(article.projects)
                .map(key => projects[key])
                .indexOf(projectFilter) > -1
            );
          }
        }
        return false;
      }) as List<articleType>;
  }
  return articlesInProject;
};

const getVisibleArticles = (
  articles: List<articleType>,
  articleList: ArticleListType
): List<articleType> => {
  const { visibilityFilter, projectFilter } = articleList;

  const articlesInProject = getArticlesWithProject(
    articles,
    projectFilter
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

function mapStateToProps(state: any, ownProps: any) {
  return {
    articles: getVisibleArticles(
      state.get('articles'),
      state
        .get('articleLists')
        .find((list: ArticleListType) => list.id === ownProps.id)
    )
  };
}

const mapDispatchToProps = {
  onArticleClick: toggleArticleRead
};

const VisibleArticleList = connect(mapStateToProps, mapDispatchToProps)(
  ArticleList
);

export default VisibleArticleList;
