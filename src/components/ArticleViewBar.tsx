import * as React from 'react';
import { Article as ArticleType } from '../constants/StoreState';
import {
  Collapse,
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

interface Props {
  article: ArticleType;
  showMenu: boolean;
}

interface State {
  showDetails: boolean;
}

export default class ArtivleViewBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDetails: false
    };
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
      <Fade
        className="article-list-bar"
        style={{
          backgroundColor: '#f9f9f9',
          top: '20px'
        }}
        in={this.props.showMenu}
      >
        <Navbar dark={true}>
          <Nav navbar={true}>
            <NavItem>
              <ExitArticleView />
            </NavItem>
          </Nav>
          <NavbarBrand style={{ whiteSpace: 'pre-line' }}>
            {hasTitle
              ? article.metadata.get('title') || article.metadata.get('ogTitle')
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
            ? 'Projects: ' + article.projects.map((t: string) => t + ' ').toJS()
            : ' '}
        </Collapse>
      </Fade>
    );
  }
}
