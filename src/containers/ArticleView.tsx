import * as React from 'react';

import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import {
  Collapse,
  Fade,
  Jumbotron,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  Button
} from 'reactstrap';
import { Icon } from 'react-fa';
import ArticleMenu from './ArticleMenu';
import ReactHTMLParser from 'react-html-parser';
import ExitArticleView from '../containers/actionDispatchers/ExitArticleView';
import updateBookmark from '../actions/articles/updateBookmark';
import refetchHTML from '../actions/articles/refetchHTML';
const debounce = require('lodash.debounce');

interface Props {
  article: ArticleType;
  HTMLContent: string;
  onRefetch: (id: string) => void;
}
interface State {
  scrollPosition: number;
  showMenu: boolean;
  showDetails: boolean;
  articleNodeList: any;
}

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      showMenu: true,
      showDetails: false,
      articleNodeList: null
    };
    this.handleScroll = debounce(this.handleScroll, 100).bind(this);
    this.scrollToBookmark = this.scrollToBookmark.bind(this);
  }

  scrollToBookmark() {
    const elements = document
      .querySelectorAll('div.page')[0]
      .getElementsByTagName('*');
    const target = Array.from(elements).find(
      el => el.textContent === this.props.article.bookmark
    );
    if (target) {
      window.removeEventListener('scroll', this.handleScroll);
      target.scrollIntoView(true);
      this.setState({ showMenu: false });
      setTimeout(
        () => window.addEventListener('scroll', this.handleScroll),
        1200
      );
    }
  }

  componentDidMount() {
    const { article, HTMLContent } = this.props;
    // Div page is classname produced from Readability parsing
    const allElements = document.querySelectorAll('div.page p');
    const textElements: any = [];
    for (let i = 0, max = allElements.length; i < max; i++) {
      const element = allElements[i];
      if (element.textContent) {
        textElements.push(element);
      }
    }

    window.addEventListener('scroll', this.handleScroll);
    if (article.bookmark && HTMLContent) {
      this.scrollToBookmark();
    }
    if (!HTMLContent && article) {
      this.props.onRefetch(this.props.article.id);
    }
    this.setState({
      articleNodeList: textElements
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  getBookmark() {
    const elements = this.state.articleNodeList;
    for (let i = 0, max = elements.length; i < max; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth) &&
        element.textContent !== this.props.article.bookmark
      ) {
        updateBookmark(this.props.article.id, element.textContent);
        break;
      }
    }
  }
  handleScroll() {
    this.setState({
      scrollPosition: window.scrollY,
      showMenu:
        window.scrollY < 20 || this.state.scrollPosition > window.scrollY
    });
    this.getBookmark();
  }

  render() {
    const { article, HTMLContent } = this.props;
    const hasTitle = article.metadata
      ? article.metadata.has('title') || article.metadata.has('oGtitle')
      : false;
    const hasDescription = article.metadata
      ? article.metadata.has('description') ||
        article.metadata.has('ogDescrption')
      : false;
    const hasSiteName = article.metadata
      ? article.metadata.has('siteName') || article.metadata.has('ogSiteName')
      : false;

    const width = window.innerWidth > 768 ? '65vw' : '90vw';
    return (
      <Jumbotron
        style={{ backgroundColor: '#C3B59F', margin: '0 auto', width: width }}
      >
        <Fade
          className="article-list-bar"
          style={{
            backgroundColor: '#668F80',
            top: '20px'
          }}
          in={this.state.showMenu}
        >
          <Navbar dark={true}>
            <Nav navbar={true}>
              <NavItem>
                <ExitArticleView />
              </NavItem>
            </Nav>
            <NavbarBrand style={{ whiteSpace: 'pre-line' }}>
              {hasTitle
                ? article.metadata.get('title') ||
                  article.metadata.get('ogTitle')
                : article.link}
            </NavbarBrand>
            <Nav className="ml-auto" navbar={true}>
              <NavItem>
                <Button
                  size="sm"
                  onClick={() =>
                    this.setState({ showDetails: !this.state.showDetails })
                  }
                >
                  <Icon name="info" />
                </Button>
                <ArticleMenu article={article} />
              </NavItem>
            </Nav>
          </Navbar>
          <Collapse isOpen={this.state.showDetails}>
            {' '}
            {hasSiteName
              ? article.metadata.get('siteName') ||
                article.metadata.get('ogSiteName')
              : ''}
            {hasSiteName && hasDescription ? ' - ' : ''}
            {hasDescription
              ? article.metadata.get('ogDescrption') ||
                article.metadata.get('description')
              : ''}
            {article.dateAdded ? (
              <small>
                Date added: {article.dateAdded.toLocaleDateString()} <br />
              </small>
            ) : (
              ''
            )}
            {!article.viewedOn.isEmpty() ? (
              <small>
                {`Last viewed on ${article.viewedOn.last().toLocaleString()}
                        - viewed ${article.viewedOn.size} time(s)`}
                <br />
              </small>
            ) : (
              ''
            )}
            {article.dateRead ? (
              <small>
                {'Date Read: ' + article.dateRead.toLocaleDateString()}
                <br />
              </small>
            ) : (
              ' '
            )}
            {article.projects
              ? 'Projects: ' +
                article.projects.map((t: string) => t + ' ').toJS()
              : ' '}
          </Collapse>
        </Fade>
        {HTMLContent && <>{ReactHTMLParser(HTMLContent)}</>}
      </Jumbotron>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    article: state
      .get('articles')
      .find((t: ArticleType) => t.id === state.get('ui').currentArticle),
    HTMLContent: state.get('ui').currentHTML
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onRefetch: (id: string) => dispatch(refetchHTML(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleView);
