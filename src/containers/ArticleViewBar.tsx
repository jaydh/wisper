import * as React from 'react';
import { connect } from 'react-redux';
import { Article as ArticleType } from '../constants/StoreState';
import {
  Collapse,
  ButtonGroup,
  Fade,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  Button
} from 'reactstrap';
import { Icon } from 'react-fa';
import ArticleMenu from '../containers/ArticleMenu';
import ExitArticleView from '../containers/actionDispatchers/ExitArticleView';
import refetchHTML from '../actions/articles/refetchHTML';
import setCurrentArticle from '../actions/ui/setCurrentArticle';
import setArticleViewFontSize from '../actions/ui/setArticleViewFontSize';

interface Props {
  article: ArticleType;
  showMenu: boolean;
  onRefetch: (id: string) => void;
  onReset: (id: string) => void;
  onSetFontSize: (size: number) => void;
  fontSize: number;
  darkModeToggler: () => void;
}

interface State {
  showDetails: boolean;
}

class ArticleViewBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDetails: false
    };
  }
  componentWillUpdate(nextProps: Props) {
    if (this.props.article.fetching && !nextProps.article.fetching) {
      // Reset current article
      this.props.onReset(this.props.article.id);
    }
  }

  render() {
    const { article, fontSize, onSetFontSize } = this.props;
    console.log();
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
      <Fade
        className="article-view-bar"
        style={{
          backgroundColor: '#679bef',
          margin: '0 auto',
          top: '20px'
        }}
        in={this.props.showMenu}
      >
        <Navbar dark={true}>
          <Nav navbar={true}>
            <NavItem>
              <ButtonGroup size="sm">
                <ExitArticleView />
                <Button onClick={() => this.props.onRefetch(article.id)}>
                  <Icon name="refresh" />
                </Button>
              </ButtonGroup>
            </NavItem>
          </Nav>
          <NavbarBrand style={{ margin: '0 auto', whiteSpace: 'pre-line' }}>
            {article.fetching && <Icon spin={true} name="spinner" />}
            {hasTitle
              ? article.metadata.get('title') || article.metadata.get('ogTitle')
              : article.link}
          </NavbarBrand>
          <Nav className="ml-auto" navbar={true}>
            <NavItem>
              <ButtonGroup size="sm">
                <Button
                  onClick={() =>
                    this.setState({ showDetails: !this.state.showDetails })
                  }
                >
                  <Icon name="info" />
                </Button>
                <Button onClick={() => onSetFontSize(fontSize - 0.1)}>
                  <Icon name="font" />
                </Button>
                <Button onClick={() => onSetFontSize(fontSize + 0.1)}>
                  <Icon name="font" size="lg" />
                </Button>
                <Button onClick={() => this.props.darkModeToggler()}>
                  <Icon name="adjust" />
                </Button>
                <ArticleMenu article={article} />
              </ButtonGroup>
            </NavItem>
          </Nav>
        </Navbar>
        <Collapse className="article-list-bar" isOpen={this.state.showDetails}>
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
            ? 'Projects: ' + article.projects.map((t: string) => t + ' ').toJS()
            : ' '}
        </Collapse>
      </Fade>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    fontSize: state.get('ui').articleViewFontSize
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onRefetch: (id: string) => dispatch(refetchHTML(id)),
    onReset: (id: string) => dispatch(setCurrentArticle(id)),
    onSetFontSize: (size: number) => dispatch(setArticleViewFontSize(size))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleViewBar);
