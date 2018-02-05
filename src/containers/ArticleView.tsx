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

interface Props {
  article: ArticleType;
}
interface State {
  scrollPosition: number;
  scrollUp: boolean;
  ticking: boolean;
  showDetails: boolean;
}

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      scrollUp: true,
      ticking: false,
      showDetails: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    if (this.props.article.bookmark) {
      const elements = document
        .querySelectorAll('div.page')[0]
        .getElementsByTagName('*');
      const target = Array.from(elements).find(
        el => el.textContent === this.props.article.bookmark
      );
      if (target) {
        target.scrollIntoView(true);
      }
    }
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll(event: any) {
    window.requestAnimationFrame(() => {
      // Div page is classname produced from Readability parsing
      const elements = document
        .querySelectorAll('div.page')[0]
        .getElementsByTagName('*');
      for (let i = 0, max = elements.length; i < max; i++) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight ||
              document.documentElement
                .clientHeight) /*or $(window).height() */ &&
          rect.right <=
            (window.innerWidth ||
              document.documentElement.clientWidth) /*or $(window).width() */ &&
          element.textContent
        ) {
          updateBookmark(this.props.article.id, element.textContent);
          break;
        }
      }
    });

    if (
      (!this.state.ticking &&
        this.state.scrollPosition < window.scrollY - 25) ||
      this.state.scrollPosition > window.scrollY + 100
    ) {
      window.requestAnimationFrame(() => {
        this.setState({
          scrollPosition: window.scrollY,
          scrollUp:
            window.scrollY < 20 || this.state.scrollPosition > window.scrollY,
          ticking: false
        });
      });
      this.setState({ ticking: true });
    }
  }

  render() {
    const { article } = this.props;
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
          in={this.state.scrollUp}
        >
          <Navbar dark={true}>
            <Nav navbar={true}>
              <NavItem>
                <ExitArticleView />
              </NavItem>
            </Nav>
            <NavbarBrand style={{ whiteSpace: 'pre-line' }}>
              {hasSiteName
                ? article.metadata.get('siteName') ||
                  article.metadata.get('ogSiteName')
                : ''}
              {hasSiteName && hasDescription ? ' - ' : ''}
              {hasDescription
                ? article.metadata.get('ogDescrption') ||
                  article.metadata.get('description')
                : ''}
              {hasTitle
                ? article.metadata.get('title') ||
                  article.metadata.get('ogTitle')
                : article.link}
              {hasSiteName
                ? article.metadata.get('siteName') ||
                  article.metadata.get('ogSiteName')
                : ''}
              {hasSiteName && hasDescription ? ' - ' : ''}
              {hasDescription
                ? article.metadata.get('ogDescrption') ||
                  article.metadata.get('description')
                : ''}
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
        {article.HTMLContent && <>{ReactHTMLParser(article.HTMLContent)}</>}
      </Jumbotron>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    article: state
      .get('articles')
      .find((t: ArticleType) => t.id === state.get('ui').currentArticle)
  };
};

export default connect(mapStateToProps)(ArticleView);
