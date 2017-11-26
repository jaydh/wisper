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
import { isBefore } from 'date-fns';
import * as Fuse from 'fuse.js';

function getArticlesWithProject(
  articles: List<articleType>,
  projectFilter: string
) {
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
}

function getVisibleArticles(
  articles: List<articleType>,
  visibilityFilter: string
): List<articleType> {
  switch (visibilityFilter) {
    case 'All':
      return articles;
    case 'Completed':
      return articles.filter((t: articleType) => t.completed) as List<
        articleType
      >;
    case 'Active':
      return articles.filter((t: articleType) => !t.completed) as List<
        articleType
      >;
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
}

function getSortedArticles(articles: List<articleType>, sort: string) {
  switch (sort) {
    case 'date-desc':
      return articles
        .sort((a, b) => (isBefore(a.dateAdded, b.dateAdded) ? -1 : 1))
        .toList();
    case 'date-asc':
      return articles
        .sort((b, a) => (isBefore(b.dateAdded, a.dateAdded) ? 1 : -1))
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
          const aa = a.dateRead ? a.dateRead : new Date();
          const bb = b.dateRead ? b.dateRead : new Date();
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

function getSearchedArticles(articles: List<articleType>, search: string) {
  const options = {
    shouldSort: false,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'metadata.title',
      'metadata.ogTitle',
      'metadata.description',
      'metadata.ogDescription',
      'metadata.siteName',
      'metadata.ogSiteName',      
      'link',
      'projects'
    ]
  };
  const fuse = new Fuse(
    articles
      .map((t: articleType) => {
        const arrayedProjects = t.projects
          ? fromJS(t.projects)
              .valueSeq()
              .toJS()
          : null;
        return { ...t, projects: arrayedProjects };
      })
      .toJS(),
    options
  );
  const idsInSearch = fromJS(fuse.search(search))
    .valueSeq()
    .map((t: any) => t.get('id'))
    .valueSeq();
  return articles
    .filter((t: articleType) => idsInSearch.contains(t.id))
    .toList();
}

function mapStateToProps(state: any, ownProps: any) {
  const articleList = state
    .get('articleLists')
    .find((list: ArticleListType) => list.id === ownProps.id);
  const articles = state.get('articles');
  const { visibilityFilter, projectFilter, sort } = articleList;
  const articlesInActivity = getVisibleArticles(articles, visibilityFilter);
  const articleInActivityAndProject = getArticlesWithProject(
    articlesInActivity,
    projectFilter
  );
  const articlesinSearch = articleList.search
    ? getSearchedArticles(articleInActivityAndProject, articleList.search)
    : articleInActivityAndProject;
  const final = getSortedArticles(articlesinSearch, sort);

  return {
    articles: final,
    articlesInActivity,
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
