import { connect } from 'react-redux';
import ArticleList from '../components/ArticleList';
import { List, fromJS } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { isBefore, isToday } from 'date-fns';
import * as Fuse from 'fuse.js';

function getArticlesWithProject(
  articles: List<articleType>,
  projectFilter: string
) {
  let articlesInProject: List<articleType>;
  switch (projectFilter) {
    case 'All Projects':
      articlesInProject = articles;
      break;
    case 'None':
      articlesInProject = articles.filter((article: articleType) => {
        return article.projects.isEmpty();
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
    case 'Today':
      return articles.filter(
        (t: articleType) =>
          t.dateRead
            ? isToday(t.viewedOn.last()) || isToday(t.dateRead)
            : isToday(t.viewedOn.last())
      ) as List<articleType>;
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
}

function getSortedArticles(articles: List<articleType>, sort: string) {
  const sortByDate = (reverse?: boolean) =>
    reverse
      ? articles
          .sort((b, a) => (isBefore(a.dateAdded, b.dateAdded) ? -1 : 1))
          .toList()
      : articles
          .sort((a, b) => (isBefore(a.dateAdded, b.dateAdded) ? -1 : 1))
          .toList();
  const sortByTitle = (reverse?: boolean) =>
    reverse
      ? articles
          .sort((a, b) => {
            const aa =
              a.metadata &&
              (a.metadata.has('title') || a.metadata.has('ogTitle'))
                ? a.metadata.get('title') || a.metadata.get('ogTitle')
                : a.link;

            const bb =
              b.metadata &&
              (b.metadata.has('title') || b.metadata.has('ogTitle'))
                ? b.metadata.get('title') || b.metadata.get('ogTitle')
                : b.link;
            return aa.localeCompare(bb);
          })
          .toList()
      : articles
          .sort((b, a) => {
            const aa =
              a.metadata &&
              (a.metadata.has('title') || a.metadata.has('ogTitle'))
                ? a.metadata.get('title') || a.metadata.get('ogTitle')
                : a.link;

            const bb =
              b.metadata &&
              (b.metadata.has('title') || b.metadata.has('ogTitle'))
                ? b.metadata.get('title') || b.metadata.get('ogTitle')
                : b.link;
            return aa.localeCompare(bb);
          })
          .toList();
  const sortByRead = (reverse?: boolean) =>
    reverse
      ? articles
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
          .toList()
      : articles
          .sort((b, a) => {
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
  const sortByViewed = (reverse?: boolean) =>
    reverse
      ? articles
          .sort((a, b) => {
            const aa = a.viewedOn.last();
            const bb = b.viewedOn.last();
            if (!aa) {
              return 1;
            }
            if (!bb) {
              return -1;
            }
            return isBefore(aa, bb) ? 1 : -1;
          })
          .toList()
      : articles
          .sort((b, a) => {
            const aa = a.viewedOn.last();
            const bb = b.viewedOn.last();
            if (!aa) {
              return 1;
            }
            if (!bb) {
              return -1;
            }

            return isBefore(aa, bb) ? 1 : -1;
          })
          .toList();

  const sortByPercent = (reverse?: boolean) =>
    reverse
      ? articles.sort((a: articleType, b: articleType) => {
          return a.progress > b.progress ? 1 : -1;
        })
      : articles.sort(
          (a: articleType, b: articleType) => (a.progress > b.progress ? -1 : 1)
        );

  switch (sort) {
    case 'date-desc':
      return sortByDate();
    case 'date-asc':
      return sortByDate(true);
    case 'title':
      return sortByTitle();
    case 'title-reverse':
      return sortByTitle(true);
    case 'dateRead':
      return sortByRead();
    case 'dateRead-reverse':
      return sortByRead(true);
    case 'viewed':
      return sortByViewed();
    case 'viewed-reverse':
      return sortByViewed(true);
    case 'percent':
      return sortByPercent();
    case 'percent-reverse':
      return sortByPercent(true);
    default:
      return articles;
  }
}

function getSearchedArticles(articles: List<articleType>, search: string) {
  const options = {
    shouldSort: false,
    threshold: 0.2,
    tokenize: true,
    location: 0,
    distance: articles.size,
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
        return {
          ...t,
          projects: t.projects.toJS(),
          metadata: t.metadata.toJS()
        };
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
  const articleList = state.get('articleLists');
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
    articlesInActivity
  };
}

export default connect(mapStateToProps)(ArticleList);
