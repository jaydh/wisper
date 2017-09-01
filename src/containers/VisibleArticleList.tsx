import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { List } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
// error when typing articleInProj with List<articleType>;

const getArticlesWithProject = (
  articles: List<articleType>,
  projectFilter: string
) => {
  let articlesInProject;
  switch (projectFilter) {
    case 'All':
      articlesInProject = articles;
      break;
    case 'None':
      articlesInProject = articles.filter((article: articleType) => {
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
      articlesInProject = articles.filter((article: articleType) => {
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

  const articlesInProject = getArticlesWithProject(articles, projectFilter);
  switch (visibilityFilter) {
    case 'All':
      return articlesInProject;
    case 'Completed':
      return articlesInProject.filter(t => {
        return t ? t.completed : false;
      }) as List<articleType>;
    case 'Active':
      return articlesInProject.filter(t => {
        return t ? !t.completed : false;
      }) as List<articleType>;
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
};

function mapStateToProps(state: any, ownProps: any) {
  const articleList = state
    .get('articleLists')
    .find((list: ArticleListType) => list.id === ownProps.id);
  return {
    articles: getVisibleArticles(state.get('articles'), articleList),
    order: articleList.order,
    articleListNum: state.get('articleLists').size,
    articleList
  };
}

const VisibleArticleList = connect(mapStateToProps)(ArticleList);

export default VisibleArticleList;
