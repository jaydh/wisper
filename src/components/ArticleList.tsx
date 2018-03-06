import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/actionDispatchers/AddArticle';
import SetArticleListSearch from '../containers/actionDispatchers/SetArticleListSearch';
import ProjectSelector from '../containers/actionDispatchers/ProjectSelector';
import ActiveSelector from '../containers/actionDispatchers/ActiveSelector';
import Sort from '../containers/actionDispatchers/Sort';
import SetArticleListView from '../containers/actionDispatchers/SetArticleListView';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import { Container, Row, Col, Card, ButtonGroup, ListGroup } from 'reactstrap';
import { forceCheck } from 'react-lazyload';

interface Props {
  articles: List<articleType>;
  articlesInActivity: List<articleType>;
  sort: string;
  projectFilter: string;
  articleListView: string;
}

class ArticleList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  componentDidUpdate() {
    forceCheck();
  }
  componentDidMount() {
    document.title = 'wispy - Articles';
  }
  render() {
    const {
      articles,
      articlesInActivity,
      articleListView
    } = this.props;

    return (
      <Container>
        <div style={{ marginTop: '3em' }} />
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <AddArticle />
          </Col>
        </Row>
        <Row>
          <ButtonGroup>
            <ActiveSelector />
            <ProjectSelector articlesInActivity={articlesInActivity} />
            <Sort />
            <SetArticleListView articlesSize={articles.size} />
          </ButtonGroup>
        </Row>
        <SetArticleListSearch />
        <Row>
          <Card>
            <ListGroup>
              {articles.map((article: articleType) => {
                return (
                  <Article
                    key={article.id}
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
