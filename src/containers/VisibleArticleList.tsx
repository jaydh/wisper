import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
// import { StoreState } from '../constants/StoreState';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import { ListenToFirebase } from '../actions/syncArticles';
import { List } from 'immutable';
import { Article as articleType, ArticleList as ArticleListType } from '../constants/StoreState';
// error when typing articleInProj with List<articleType>;

const getVisibleArticles = (
  articles: List<articleType>,
  articleList: ArticleListType
) => {
  const { projectFilter, visibilityFilter } = articleList;
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
      });
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

function mapStateToProps(state: any, ownProps: any) {
  console.log('1')
  return {
    articles: getVisibleArticles(
      state.get('articles'),
      state.get('articleLists').get(ownProps.id)
    )
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
