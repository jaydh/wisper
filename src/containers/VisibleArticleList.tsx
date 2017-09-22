import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { List, fromJS } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
import {
  resizeArticleList,
  repositionArticleList
} from '../actions/articleList';

const getArticlesWithProject = (
  articles: List<articleType>,
  projectFilter: string
) => {
  let articlesInProject: List<articleType>;
  switch (projectFilter) {
    case 'All':
      articlesInProject = articles;
      break;
    case 'None':
      articlesInProject = articles.filter((article: articleType) => {
        return !article.projects;
      }) as List<articleType>;
      break;
    default:
      articlesInProject = articles.filter((article: articleType) => {
        const projects = fromJS(article.projects);
        return projects ? projects.includes(projectFilter) : false;
      }) as List<articleType>;
  }
  return articlesInProject;
};

const getVisibleArticles = (
  articles: List<articleType>,
  articleList: ArticleListType
): List<articleType> => {
  const { visibilityFilter, projectFilter, sort } = articleList;
  const sortedArticles = getSortedArticles(articles, sort);
  const articlesInProject = getArticlesWithProject(
    sortedArticles,
    projectFilter
  );
  switch (visibilityFilter) {
    case 'All':
      return articlesInProject;
    case 'Completed':
      return articlesInProject.filter((t: articleType) => t.completed) as List<
        articleType
      >;
    case 'Active':
      return articlesInProject.filter((t: articleType) => !t.completed) as List<
        articleType
      >;
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
};

function getSortedArticles(articles: List<articleType>, sort: string) {
  switch (sort) {
    case 'date-desc':
      return articles
        .sort((a, b) => {
          const aa = new Date(a.dateAdded);
          const bb = new Date(b.dateAdded);
          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        })
        .toList();
    case 'date-asc':
      return articles
        .sort((b, a) => {
          const aa = new Date(a.dateAdded);
          const bb = new Date(b.dateAdded);
          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        })
        .toList();

    case 'title':
      return articles
        .sort((a, b) => {
          const aa =
            a.metadata && (a.metadata.title || a.metadata.ogTitle)
              ? a.metadata.ogTitle || a.metadata.title
              : a.link;

          const bb =
            b.metadata && (b.metadata.title || b.metadata.ogTitle)
              ? b.metadata.ogTitle || b.metadata.title
              : b.link;
          return aa.localeCompare(bb);
        })
        .toList();
    case 'dateRead':
      return articles
        .sort((a, b) => {
          const aa = a.dateRead ? new Date(a.dateRead) : new Date();
          const bb = b.dateRead ? new Date(b.dateRead) : new Date();
          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        })
        .toList();
    default:
      return articles;
  }
}

function mapStateToProps(state: any, ownProps: any) {
  const articleList = state
    .get('articleLists')
    .find((list: ArticleListType) => list.id === ownProps.id);
  return {
    articles: getVisibleArticles(state.get('articles'), articleList),
    order: articleList.order,
    sort: articleList.sort,
    projectFilter: articleList.projectFilter,
    xPosition: articleList.xPosition,
    yPosition: articleList.yPosition,
    height: articleList.height,
    width: articleList.width,
    locked: articleList.locked
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onResize: (x: number, y: number) => {
      dispatch(resizeArticleList(ownProps.id, x, y));
    },
    onReposition: (x: number, y: number) => {
      dispatch(repositionArticleList(ownProps.id, x, y));
    }
  };
};

const VisibleArticleList = connect(mapStateToProps, mapDispatchToProps)(
  ArticleList
);

export default VisibleArticleList;
