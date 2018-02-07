import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { Jumbotron } from 'reactstrap';
import ReactHTMLParser from 'react-html-parser';
import updateBookmark from '../actions/articles/updateBookmark';
import refetchHTML from '../actions/articles/refetchHTML';
import ArticleViewBar from '../components/ArticleViewBar';
const debounce = require('lodash.debounce');

interface Props {
  article: ArticleType;
  HTMLContent: string;
  onRefetch: (id: string) => void;
}
interface State {
  scrollPosition: number;
  showMenu: boolean;
  articleNodeList: any;
}

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      showMenu: true,
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
    // Find all nodes in page with textContent
    this.setState({
      articleNodeList: Array.from(
        document.querySelectorAll('div.page p')
      ).filter(el => el.textContent)
    });

    if (article.bookmark && HTMLContent) {
      this.scrollToBookmark();
    }
    if (!HTMLContent && article) {
      this.props.onRefetch(this.props.article.id);
    }
    window.addEventListener('scroll', this.handleScroll);
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
    return (
      <Jumbotron
        style={{
          backgroundColor: '#C3B59F',
          margin: '0 auto',
          width: window.innerWidth > 768 ? '65vw' : '90vw'
        }}
      >
        <ArticleViewBar showMenu={this.state.showMenu} article={article} />
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
