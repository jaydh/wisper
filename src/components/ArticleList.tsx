import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import Footer from './ArticleListFooter';
import ProjectSelector from '../containers/ProjectSelector';
import { List } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
import { Jumbotron, ListGroup, ListGroupItem } from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
}
interface State {
  width: number;
  height: number;
}
class ArticleList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.7
    };
  }

  render() {
    const { articles, id, filters } = this.props;
    return (
      <Jumbotron
        style={{
          width: this.state.width * 0.9 - 20,
          height: this.state.height * 0.8 - 20
        }}
      >
        <Rnd
          className="article-list-container"
          default={{
            x: 0,
            y: 0,
            width: this.state.width * 0.9 - 40,
            height: this.state.height * 0.8 - 40
          }}
          z={2}
          minWidth={500}
          minHeight={190}
          bounds=".canvas"
          style={{
            overflow: 'auto',
            padding: '20'
          }}
        >
          <AddArticle filters={filters} />
          <ProjectSelector id={id} />
          <Footer id={id} />
          <ListGroup >
            {articles.map(article => {
              return article
                ? <ListGroupItem
                    key={article.id}
                    bsStyle={article.completed ? 'success' : 'info'}
                  >
                    <Article key={article.id} {...article} />
                  </ListGroupItem>
                : <br />;
            })}
          </ListGroup>
        </Rnd>
      </Jumbotron>
    );
  }
}
export default ArticleList;
