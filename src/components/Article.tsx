import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import articleViewed from '../actions/articles/articleViewed';
import setCurrentArticle from '../actions/ui/setCurrentArticle';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import setUIView from '../actions/ui/setUIView';
import ArticleMenu from '../containers/ArticleMenu';
import {
  Fade,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Collapse,
  ListGroupItem,
  Container,
  Col,
  Row,
  Progress
} from 'reactstrap';
import LazyLoad from 'react-lazyload';
import { Icon } from 'react-fa';

interface Props {
  onArticleView: (t: string) => void;
  onSetUIView: (t: string) => void;
  onSetCurrentArticle: (id: string) => void;
  article: articleType;
  compact: boolean;
  scrolling: boolean;
  showAddProjectModal: (id: string) => void;
}
interface State {
  isMenuOpen: boolean;
  showCollapse: boolean;
}

class Article extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      showCollapse: false
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    this.setState({ showCollapse: !this.state.showCollapse });
  }

  render() {
    const {
      onArticleView,
      article,
      onSetCurrentArticle,
      onSetUIView,
      compact
    } = this.props;
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

    const title = hasTitle
      ? article.metadata.get('title') || article.metadata.get('ogTitle')
      : article.link;
    return (
      <ListGroupItem
        onMouseEnter={() => this.setState({ isMenuOpen: true })}
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
        style={{ backgroundColor: 'white' }}
      >
        <LazyLoad height="300" offset={600} overflow={false}>
          <Container>
            <Row>
              {!compact && (
                <Col xs={4} sm={4} md={2} lg={2}>
                  <img
                    className="img-fluid img-thumbnail"
                    style={{ height: '10vh' }}
                    onTouchEnd={() =>
                      this.setState({
                        isMenuOpen: !this.state.isMenuOpen
                      })
                    }
                    src={
                      article.metadata.has('images')
                        ? article.metadata.get('images').get(0)
                        : 'http://images6.fanpop.com/image/photos/34100000/Brave-brave-34108077-442-500.jpg'
                    }
                  />
                </Col>
              )}
              <Col
                xs={compact ? 12 : 8}
                sm={compact ? 12 : 8}
                md={compact ? 12 : 10}
                lg={compact ? 12 : 10}
              >
                <Card
                  style={{
                    textOverflow: 'ellipsis',
                    backgroundColor: 'white'
                  }}
                >
                  <CardHeader
                    onClick={() =>
                      this.setState({ showCollapse: !this.state.showCollapse })
                    }
                  >
                    <Row>
                      <Col xs="10" sm="7" md="8" lg="9">
                        <Button
                          color="link"
                          onClick={() => {
                            onArticleView(article.id);
                            onSetCurrentArticle(article.id);
                            onSetUIView('article');
                          }}
                          style={{ whiteSpace: 'pre-line' }}
                        >
                          {article.fetching && (
                            <Icon spin={true} name="spinner" />
                          )}
                          {this.state.showCollapse
                            ? title
                            : `${title.substring(0, 50)}...`}
                        </Button>
                      </Col>
                      <Col sm="auto" md={{ size: 4 }} lg={{ size: 3 }}>
                        <Fade in={this.state.isMenuOpen}>
                          <ArticleMenu
                            article={article}
                            collapseHandler={this.toggleCollapse}
                          />
                        </Fade>
                      </Col>
                    </Row>
                  </CardHeader>
                  <Collapse isOpen={this.state.showCollapse}>
                    <CardBody>
                      <CardTitle>
                        {hasSiteName
                          ? article.metadata.get('siteName') ||
                            article.metadata.get('ogSiteName')
                          : ''}
                        {hasSiteName && hasDescription ? ' - ' : ''}
                        {hasDescription
                          ? article.metadata.get('ogDescrption') ||
                            article.metadata.get('description')
                          : ''}
                      </CardTitle>
                      {article.dateAdded ? (
                        <small>
                          Date added: {article.dateAdded.toLocaleDateString()}{' '}
                          <br />
                        </small>
                      ) : (
                        ''
                      )}
                      {!article.viewedOn.isEmpty() ? (
                        <small>
                          {`Last viewed on ${article.viewedOn
                            .last()
                            .toLocaleString()}
                        - viewed ${article.viewedOn.size} time(s)`}
                          <br />
                        </small>
                      ) : (
                        ''
                      )}
                      {article.dateRead ? (
                        <small>
                          {'Date Read: ' +
                            article.dateRead.toLocaleDateString()}
                          <br />
                        </small>
                      ) : (
                        ' '
                      )}
                      {article.projects
                        ? 'Projects: ' +
                          article.projects.map((t: string) => t + ' ').toJS()
                        : ' '}
                      <AddArticleToProject
                        id={article.id}
                        articleProjects={article.projects}
                        showAddProjectModal={this.props.showAddProjectModal}
                      />
                    </CardBody>
                  </Collapse>
                  {article.progress &&
                    article.progress > 0 && (
                      <Progress color="success" value={article.progress}>
                        {Math.round(article.progress)}%
                      </Progress>
                    )}
                </Card>
              </Col>
            </Row>
          </Container>
        </LazyLoad>
      </ListGroupItem>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return ownProps;
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onArticleView: (articleID: string) => {
      dispatch(articleViewed(articleID));
    },
    onSetUIView: (view: string) => {
      dispatch(setUIView(view));
    },
    onSetCurrentArticle: (id: string) => {
      dispatch(setCurrentArticle(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
