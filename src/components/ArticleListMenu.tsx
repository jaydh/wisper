import * as React from 'react';
import ActiveSelector from '../containers/actionDispatchers/ActiveSelector';
import AddArticle from '../containers/actionDispatchers/AddArticle';
import SetArticleListSearch from '../containers/actionDispatchers/SetArticleListSearch';
import Sort from '../containers/actionDispatchers/Sort';
import SaveArticles from '../containers/actionDispatchers/SaveArticles';
import { ButtonGroup, Button, Row, Col, Badge } from 'reactstrap';
import { Icon } from 'react-fa';
import { List } from 'immutable';
import { Article } from '../constants/StoreState';

interface Props {
  fullView: boolean;
  toggleView: () => void;
  articles: List<Article>;
}
export default class extends React.Component<Props> {
  render() {
    const { articles } = this.props;
    return (
      <>
        <Row>
          <Col>
            <AddArticle />
          </Col>
        </Row>
        <Row>
          <Col md="7" lg="8">
            <ButtonGroup>
              <ActiveSelector />
              <Sort />
              <Button type="button" onClick={() => this.props.toggleView()}>
                <Icon
                  name={this.props.fullView ? 'th-list' : 'align-justify'}
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
      </>
    );
  }
}
