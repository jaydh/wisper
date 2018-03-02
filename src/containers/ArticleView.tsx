import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { Jumbotron, Fade, Button } from 'reactstrap';
import ReactHTMLParser from 'react-html-parser';
import updateBookmark from '../actions/articles/updateBookmark';
import updateProgress from '../actions/articles/updateProgress';
import ArticleViewBar from './ArticleViewBar';
import { Icon } from 'react-fa';
const debounce = require('lodash.debounce');

interface Props {
  article: ArticleType;
  HTMLContent: string;
  fontSize: number;
}

interface State {
  scrollPosition: number;
  showMenu: boolean;
  articleNodeList: any;
  fontSize: number;
  darkMode: boolean;
}

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      showMenu: true,
      articleNodeList: null,
      fontSize: 1.0,
      darkMode: false
    };
    this.progressScrollHandler = debounce(
      this.progressScrollHandler.bind(this),
      2000
    );
    this.menuScrollHandler = this.menuScrollHandler.bind(this);
    this.scrollToBookmark = debounce(this.scrollToBookmark.bind(this));
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
  }

  componentDidMount() {
    const { article } = this.props;
    document.title = 'wispy - ' + article.metadata.get('title');
    // Div page is classname produced from Readability parsing
    // Find all nodes in page with textContent
    this.setState(
      {
        articleNodeList: Array.from(
          document.querySelectorAll('div.page p')
        ).filter(el => el.textContent)
      },
      () => this.scrollToBookmark()
    );
    let isScrolling: any;
    window.addEventListener('scroll', this.progressScrollHandler);
    window.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(this.menuScrollHandler, 66);
    });
    window.addEventListener('resize', this.scrollToBookmark);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.menuScrollHandler);
    window.removeEventListener('scroll', this.progressScrollHandler);
    window.removeEventListener('resize', this.scrollToBookmark);
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.HTMLContent !== this.props.HTMLContent) {
      this.setState(
        {
          articleNodeList: Array.from(
            document.querySelectorAll('div.page p')
          ).filter(el => el.textContent)
        },
        () => this.scrollToBookmark()
      );
      if (nextProps.fontSize !== this.props.fontSize) {
        this.scrollToBookmark();
      }
    }
  }

  scrollToBookmark() {
    const elements = this.state.articleNodeList;
    const target = Array.from(elements).find(
      (el: any) =>
        el.textContent.replace(/\s/g, '') === this.props.article.bookmark
    ) as any;
    if (target) {
      window.removeEventListener('scroll', this.progressScrollHandler);
      target.scrollIntoView(true);
      this.setState({ showMenu: false });
      window.addEventListener('scroll', this.progressScrollHandler);
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
        element.textContent.replace(/\s/g, '') !== ''
      ) {
        updateBookmark(
          this.props.article.id,
          element.textContent.replace(/\s/g, '')
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
    this.getBookmark();
    this.getScrollPercent();
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

  render() {
    const { article, HTMLContent } = this.props;
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
          <Button
            onClick={() => this.setState({ showMenu: !this.state.showMenu })}
          >
            <Icon name="universal-access" />
          </Button>
        </Fade>
        <ArticleViewBar
          showMenu={this.state.showMenu}
          article={article}
          darkModeToggler={this.toggleDarkMode}
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
const mapStateToProps = (state: any) => {
  return {
    article: state
      .get('articles')
      .find((t: ArticleType) => t.id === state.get('ui').currentArticle),
    HTMLContent: state.get('ui').currentHTML,
    fontSize: state.get('ui').articleViewFontSize
  };
};

export default connect(mapStateToProps)(ArticleView);
