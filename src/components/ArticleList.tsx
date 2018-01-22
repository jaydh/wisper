import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/actionDispatchers/AddArticle';
import SetArticleListSearch from '../containers/actionDispatchers/SetArticleListSearch';
import ProjectSelector from '../containers/actionDispatchers/ProjectSelector';
import ActiveSelector from '../containers/actionDispatchers/ActiveSelector';
import Sort from '../containers/actionDispatchers/Sort';
import DeleteArticleList from '../containers/actionDispatchers/DeleteArticleList';
import MaximizedArticleList from '../containers/actionDispatchers/MaximizeArticleList';
import LockArticleList from '../containers/actionDispatchers/LockArticleList';
import SetArticleListView from '../containers/actionDispatchers/SetArticleListView';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { Container, Row, Col, Card, ButtonGroup, ListGroup } from 'reactstrap';
import { forceCheck } from 'react-lazyload';

interface Props {
  articles: List<articleType>;
  articlesInActivity: List<articleType>;
  order: number;
  id: string;
  sort: string;
  projectFilter: string;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  locked: boolean;
  uiView: string;
  articleListView: string;
  onResize: (x: number, y: number) => void;
  onReposition: (x: number, y: number) => void;
}

interface State {
  width: number;
}

class ArticleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { width: window.innerWidth };
    this.updateWidth = this.updateWidth.bind(this);
  }
  updateWidth() {
    this.setState({ width: window.innerWidth });
  }
  componentDidUpdate() {
    forceCheck();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateWidth);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }
  render() {
    const {
      articles,
      id,
      projectFilter,
      articlesInActivity,
      locked,
      uiView,
      articleListView
    } = this.props;

    return (
      <Container>
        {!(uiView === 'compact') && (
          <Row>
            <Col sm={1} md={1}>
              <LockArticleList id={id} />
            </Col>
            <Col sm={{ size: 2, offset: 9 }} md={{ size: 2, offset: 9 }}>
              {!locked && (
                <ButtonGroup>
                  <MaximizedArticleList id={id} />
                  <DeleteArticleList id={id} />
                </ButtonGroup>
              )}
            </Col>
          </Row>
        )}
        <div style={{ marginTop: '3em' }} />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <AddArticle projectFilter={projectFilter} />
          </Col>
        </Row>
        <Row>
          <ButtonGroup vertical={this.state.width > 768 ? false : true}>
            <ActiveSelector id={id} />
            <ProjectSelector id={id} articlesInActivity={articlesInActivity} />
            <Sort id={id} />
            <SetArticleListView id={id} articlesSize={articles.size} />
          </ButtonGroup>
        </Row>
        <SetArticleListSearch id={id} />
        <Row>
          <Card>
            <ListGroup>
              {articles.map((article: articleType) => {
                return (
                  <Article
                    key={id + article.id}
                    article={article}
                    compact={articleListView === 'compact'}
                  />
                );
              })}
            </ListGroup>
          </Card>
        </Row>
      </Container>
    );
  }
}

export default ArticleList;
