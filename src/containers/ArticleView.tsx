import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { Jumbotron, Fade, Button } from 'reactstrap';
import ReactHTMLParser from 'react-html-parser';
import updateBookmark from '../actions/articles/updateBookmark';
import updateProgress from '../actions/articles/updateProgress';
import updateHTML from '../actions/articles/updateHTML';
import ArticleViewBar from './ArticleViewBar';
import { Icon } from 'react-fa';
const debounce = require('lodash.debounce');

interface Props {
  id: string;
  article: ArticleType;
  fontSize: number;
  getHTML: () => void;
}

interface State {
  scrollPosition: number;
  showMenu: boolean;
  articleNodeList: any;
  darkMode: boolean;
}
let isScrolling: any;

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      showMenu: true,
      articleNodeList: null,
      darkMode: false
    };
    this.progressScrollHandler = debounce(
      this.progressScrollHandler.bind(this),
      2000
    );
    this.menuScrollHandler = this.menuScrollHandler.bind(this);
    this.progressScrollHandler = debounce(
      this.progressScrollHandler.bind(this),
      200
    );
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
    this.getBookmark = this.getBookmark.bind(this);
    this.getScrollPercent = this.getScrollPercent.bind(this);
    this.scrollToBookmark = this.scrollToBookmark.bind(this);
  }

  componentWillMount() {
    if (!this.props.article.HTMLContent) {
      this.props.getHTML();
    }
  }

  componentDidMount() {
    const { article } = this.props;
    document.title = `wispy - ${
      article.metadata.has('title')
        ? article.metadata.get('title')
        : article.link
    }`;
    // Div page is classname produced from Readability parsing
    // Find all nodes in page with textContent
    this.setState(
      {
        articleNodeList: Array.from(
          document.querySelectorAll('div.page p')
        ).filter(el => el.textContent)
      },
      () => {
        this.scrollToBookmark();
        window.addEventListener('scroll', this.menuScrollHandler);
        window.addEventListener('scroll', this.progressScrollHandler);
        window.addEventListener('resize', this.scrollToBookmark);
      }
    );
  }

  componentWillUnmount() {
    window.clearTimeout(isScrolling);
    window.removeEventListener('scroll', this.menuScrollHandler);
    window.removeEventListener('scroll', this.progressScrollHandler);
    window.removeEventListener('resize', this.scrollToBookmark);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // Ignore scroll changes and bookmark changes
    if (
      this.props.article.HTMLContent !== nextProps.article.HTMLContent ||
      this.props.fontSize !== nextProps.fontSize ||
      this.state.showMenu !== nextState.showMenu ||
      this.state.darkMode !== nextState.darkMode
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.article.HTMLContent !== this.props.article.HTMLContent) {
      this.setState(
        {
          articleNodeList: Array.from(
            document.querySelectorAll('div.page *')
          ).filter(el => el.textContent)
        },
        () => this.scrollToBookmark()
      );
    }
    if (nextProps.fontSize !== this.props.fontSize) {
      this.scrollToBookmark();
    }
  }

  scrollToBookmark() {
    const elements = this.state.articleNodeList;
    const target = Array.from(elements).find(
      (el: any) => el.textContent === this.props.article.bookmark
    ) as any;
    if (target) {
      target.scrollIntoView(true);
    }
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
        element.textContent !== this.props.article.bookmark &&
        element.textContent !== ''
      ) {
        // User previous element unless first element
        updateBookmark(
          this.props.article.id,
          elements[i > 0 ? i - 1 : i].textContent
        );
        break;
      }
    }
  }

  getScrollPercent() {
    const h = document.documentElement,
      b = document.body,
      st = 'scrollTop',
      sh = 'scrollHeight';
    updateProgress(
      this.props.article.id,
      (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100
    );
  }

  progressScrollHandler() {
    if (this.state.articleNodeList) {
      // Only fires at end of scroll event
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        this.getBookmark();
        this.getScrollPercent();
      }, 300);
    }
  }
  menuScrollHandler() {
    if (window.scrollY < 20) {
      this.setState({ showMenu: true });
    }
    if (this.state.scrollPosition > window.scrollY) {
      this.setState({
        showMenu: true
      });
    } else {
      this.setState({ showMenu: false });
    }
    this.setState({ scrollPosition: window.scrollY });
  }

  toggleDarkMode() {
    this.setState({
      darkMode: !this.state.darkMode
    });
  }
  toggleShowMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }
  render() {
    const { article } = this.props;
    const { HTMLContent } = article;
    return (
      <div
        style={{
          backgroundColor: this.state.darkMode ? '#5c5c5c' : 'white'
        }}
      >
        <Fade
          in={!this.state.showMenu}
          className="article-view-bar"
          style={{ top: '50vh' }}
        >
          <Button onClick={() => this.toggleShowMenu()}>
            <Icon name="universal-access" />
          </Button>
        </Fade>
        <ArticleViewBar
          showMenu={this.state.showMenu}
          id={article.id}
          darkModeToggler={this.toggleDarkMode}
          showMenuToggler={this.toggleShowMenu}
        />
        <Jumbotron
          style={{
            backgroundColor: this.state.darkMode ? '#6b6b6b' : '#fffff4',
            margin: '0 auto',
            width: window.innerWidth > 768 ? '65vw' : '90vw'
          }}
        >
          {article && HTMLContent ? (
            <div
              style={{
                fontSize: this.props.fontSize + 'rem',
                color: this.state.darkMode ? '#ffbf00' : 'black'
              }}
            >
              {ReactHTMLParser(HTMLContent, {
                transform: (node: any, index: number) => {
                  if (node.name === 'img') {
                    node.attribs.class = 'img-fluid';
                    return undefined;
                  }
                  if (
                    node.name === 'a' &&
                    node.attribs.href &&
                    node.attribs.href.includes(article.link)
                  ) {
                    const id = node.attribs.href.substr(
                      node.attribs.href.indexOf('#') + 1
                    );
                    return (
                      <Button
                        color="link"
                        onClick={() => {
                          const el = document.querySelector(`#${id}`);
                          if (el) {
                            el.scrollIntoView(true);
                          } else {
                            window.open(node.attribs.href);
                          }
                        }}
                      >
                        {node.children[0].data}
                      </Button>
                    );
                  }
                  return undefined;
                }
              })}
            </div>
          ) : (
            <p>Reader Unavailable</p>
          )}
        </Jumbotron>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    getHTML: () => dispatch(updateHTML(ownProps.id))
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    article: state
      .get('articles')
      .find((t: ArticleType) => t.id === ownProps.id),
    fontSize: state.get('ui').articleViewFontSize
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleView);
