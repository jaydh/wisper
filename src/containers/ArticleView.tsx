import * as React from 'react';

import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import { Jumbotron, Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import ArticleMenu from './ArticleMenu';
import ReactHTMLParser from 'react-html-parser';
import ExitArticleView from '../containers/actionDispatchers/ExitArticleView';

interface Props {
  article: ArticleType;
}
interface State {
  scrollPosition: number;
  scrollUp: boolean;
}

class ArticleView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      scrollUp: true
    };
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
  handleScroll() {
    if (
      this.state.scrollPosition < window.scrollY - 50 ||
      this.state.scrollPosition > window.scrollY + 50
    ) {
      this.setState({
        scrollPosition: window.scrollY,
        scrollUp:
          window.scrollY < 20 || this.state.scrollPosition > window.scrollY
      });
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

    return (
      <Jumbotron>
        {this.state.scrollUp && (
          <Navbar
            dark={true}
            style={{
              backgroundColor: '#33507f',
              position: 'sticky',
              top: '20px'
            }}
          >
            <Nav navbar={true}>
              <NavItem>
                <ExitArticleView />
              </NavItem>
            </Nav>
            <NavbarBrand>
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
                <ArticleMenu article={article} />
              </NavItem>
            </Nav>
          </Navbar>
        )}
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
