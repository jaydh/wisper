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
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import {
  Glyphicon,
  Jumbotron,
  ListGroup,
  ButtonGroup,
  Row,
  Col,
  Grid
} from 'react-bootstrap';

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
  onResize: (x: number, y: number) => void;
  onReposition: (x: number, y: number) => void;
}

class ArticleList extends React.Component<Props> {
  render() {
    const {
      articles,
      id,
      projectFilter,
      articlesInActivity,
      locked,
      uiView
    } = this.props;
    const compact = uiView === 'Compact';

    return (
      <div>
        <Jumbotron
          className="article-list-container"
          style={{
            padding: '2rem'
          }}
        >
          <Grid>
            {!compact && (
              <Row>
                <Col sm={1} md={1}>
                  <LockArticleList id={id} />
                </Col>
                <Col sm={2} md={2} smOffset={9} mdOffset={9}>
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
              <Col style={{ float: 'left' }}>
                <AddArticle projectFilter={projectFilter} />
              </Col>
              <Col style={{ float: 'right' }}>
                <SetArticleListSearch id={id} />
              </Col>
            </Row>
            <Row>
              <Col xs={10} sm={9} md={6} lg={6}>
                <ButtonGroup>
                  <ActiveSelector id={id} />
                  <ProjectSelector
                    id={id}
                    articlesInActivity={articlesInActivity}
                  />
                  <Sort id={id} />
                </ButtonGroup>
              </Col>
              <Col
                xs={2}
                smOffset={1}
                sm={2}
                mdOffset={5}
                md={1}
                lgOffset={5}
                lg={1}
              >
                <Glyphicon glyph="list-alt" /> {articles.size}
              </Col>
            </Row>
            <Row>
              <ListGroup>
                {articles.map((article: articleType) => {
                  return (
                    <Article
                      key={id + article.id}
                      article={article}
                      compact={compact}
                    />
                  );
                })}
              </ListGroup>
            </Row>
          </Grid>
        </Jumbotron>
      </div>
    );
  }
}

export default ArticleList;
