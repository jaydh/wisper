import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/actionDispatchers/AddArticle';
import SetArticleListSearch from '../containers/actionDispatchers/SetArticleListSearch';
import ProjectSelector from '../containers/actionDispatchers/ProjectSelector';
import ActiveSelector from '../containers/actionDispatchers/ActiveSelector';
import Sort from '../containers/actionDispatchers/Sort';
import SaveArticles from '../containers/actionDispatchers/SaveArticles';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  ListGroup,
  Badge,
  Button
} from 'reactstrap';
import { Icon } from 'react-fa';
import { forceCheck } from 'react-lazyload';

interface Props {
  articles: List<articleType>;
  articlesInActivity: List<articleType>;
  sort: string;
  projectFilter: string;
}

interface State {
  fullView: boolean;
}

class ArticleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fullView: true };
  }
  componentDidUpdate() {
    forceCheck();
  }
  componentDidMount() {
    document.title = 'wispy - Articles';
  }

  toggleView() {
    this.setState({ fullView: !this.state.fullView });
  }
  render() {
    const { articles, articlesInActivity } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <AddArticle />
          </Col>
        </Row>
        <Row>
          <Col md="7" lg="8">
            <ButtonGroup>
              <ActiveSelector />
              <ProjectSelector articlesInActivity={articlesInActivity} />
              <Sort />
              <Button type="button" onClick={() => this.toggleView()}>
                <Icon
                  name={this.state.fullView ? 'th-list' : 'align-justify'}
                />
                <Badge>
                  <Icon name="list-alt" /> {articles.size}
                </Badge>
              </Button>
              <SaveArticles articles={articles} />
            </ButtonGroup>
          </Col>
          <Col xs="12" md={{ size: 4, offset: 1 }} lg={{ size: 3, offset: 1 }}>
            <SetArticleListSearch />
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup
              style={{
                height: '80vh',
                overflowY: 'scroll',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {articles.map((article: articleType) => {
                return (
                  <Article
                    key={article.id}
                    article={article}
                    compact={!this.state.fullView}
                  />
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ArticleList;
