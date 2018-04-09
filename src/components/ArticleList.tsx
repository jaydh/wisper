import * as React from 'react';
import Article from './Article';
import { Row, Col, ListGroup } from 'reactstrap';
import { forceCheck } from 'react-lazyload';
import ArticleListMenu from './ArticleListMenu';
import { List } from 'immutable';
import { Article as articleType } from '../constants/StoreState';
import AddProjectModal from './AddProjectModal';
import ProjectSelector from '../containers/actionDispatchers/ProjectSelector';
interface Props {
  articles: List<articleType>;
  articlesInActivity: List<articleType>;
  sort: string;
  projectFilter: string;
}

interface State {
  fullView: boolean;
  showModal: boolean;
}

class ArticleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { fullView: true, showModal: false };
    this.toggleView = this.toggleView.bind(this);
    this.setModal = this.setModal.bind(this);
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
  setModal(val: boolean) {
    this.setState({ showModal: val });
  }
  render() {
    const { articles, articlesInActivity } = this.props;

    return (
      <>
        <AddProjectModal show={this.state.showModal} toggle={this.setModal} />
        <Row>
          <Col xs={1} sm={1} md={2} lg={2}>
            <ProjectSelector articlesInActivity={articlesInActivity} />
          </Col>

          <Col>
            <ArticleListMenu
              fullView={this.state.fullView}
              toggleView={this.toggleView}
              articles={articles}
            />
            <ListGroup
              style={{
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
                    showAddProjectModal={() => this.setModal(true)}
                  />
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </>
    );
  }
}

export default ArticleList;
