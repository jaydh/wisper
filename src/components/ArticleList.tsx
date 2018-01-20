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
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Badge,
  ListGroup
} from 'reactstrap';
import { Icon } from 'react-fa';
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

class ArticleList extends React.Component<Props> {
  componentDidUpdate() {
    forceCheck();
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
          <Col xs={12} sm={5} md={6} lg={6}>
            <ButtonGroup>
              <ActiveSelector id={id} />
              <ProjectSelector
                id={id}
                articlesInActivity={articlesInActivity}
              />
              <Sort id={id} />
              <SetArticleListView id={id} />
            </ButtonGroup>
            <Badge>
              <Icon name="list-alt" /> {articles.size}
            </Badge>
          </Col>
          <Col
            xs={12}
            sm={{ size: 4, offset: 3 }}
            md={{ size: 3, offset: 3 }}
            lg={{ size: 3, offset: 3 }}
          >
            <SetArticleListSearch id={id} />
          </Col>
        </Row>
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
