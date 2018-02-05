import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import articleViewed from '../actions/articles/articleViewed';
import setCurrentArticle from '../actions/ui/setCurrentArticle';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import setUIView from '../actions/ui/setUIView';
import ArticleMenu from '../containers/ArticleMenu';
import {
  Button,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Collapse,
  ListGroupItem,
  Container,
  Col,
  Row
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
}
interface State {
  isMenuOpen: boolean;
}

class Article extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
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

    const showImage = compact ? this.state.isMenuOpen : true;
    return (
      <ListGroupItem
        onMouseEnter={() => this.setState({ isMenuOpen: true })}
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
        color={article.completed ? 'success' : 'primary'}
        style={{ backgroundColor: '#4A6670' }}
      >
        <LazyLoad height="300" offset={600} overflow={false}>
          <Container>
            <Row>
              {showImage && (
                <Col xs={4} sm={4} md={2} lg={2}>
                  <img
                    className="img-fluid img-thumbnail"
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
                xs={showImage ? 8 : 12}
                sm={showImage ? 8 : 12}
                md={showImage ? 10 : 12}
                lg={showImage ? 10 : 12}
              >
                <Card
                  style={{
                    textOverflow: 'ellipsis',
                    borderColor: '#333',
                    backgroundColor: '#CEE0DC'
                  }}
                >
                  <CardTitle>
                    <Row>
                      <Col xs={9} sm={9} md={9} lg={9}>
                        <Button
                          color="link"
                          onClick={() => {
                            onArticleView(article.id);
                            onSetCurrentArticle(article.id);
                            onSetUIView('article');
                            window.scroll(0, 0);
                          }}
                          style={{ whiteSpace: 'pre-line' }}
                        >
                          {article.fetching && (
                            <Icon spin={true} name="spinner" />
                          )}
                          {hasTitle
                            ? article.metadata.get('title') ||
                              article.metadata.get('ogTitle')
                            : article.link}
                        </Button>
                      </Col>
                      {this.state.isMenuOpen && (
                        <Col xs={3} sm={3} md={3} lg={3}>
                          <ArticleMenu article={article} />
                        </Col>
                      )}
                    </Row>
                  </CardTitle>
                  <Collapse isOpen={this.state.isMenuOpen}>
                    <CardSubtitle>
                      {hasSiteName
                        ? article.metadata.get('siteName') ||
                          article.metadata.get('ogSiteName')
                        : ''}
                      {hasSiteName && hasDescription ? ' - ' : ''}
                      {hasDescription
                        ? article.metadata.get('ogDescrption') ||
                          article.metadata.get('description')
                        : ''}
                    </CardSubtitle>
                    <CardBody>
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
                      />
                    </CardBody>
                  </Collapse>
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
