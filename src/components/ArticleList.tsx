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
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, filters } = this.props;
    return (
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: innerWidth * 0.5,
          height: innerHeight * 0.6
        }}
        z={2}
        bounds=".canvas"
        resizeGrid={[25, 25]}
        dragGrid={[25, 25]}
        style={{
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        dragHandlerClassName=".dragger"
        resizeHandlerStyles={{
          bottom: {
            height: '2em',
            position: 'fixed',
            borderBottom: '5px',
            borderColor: ' #7070db',
            borderRadius: '3px'
          }
        }}
        enableResizing={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: true,
          topLeft: false
        }}
      >
        <Button
          className="dragger"
          bsSize="xsmall"
          style={{ height: '2em', width: '100%' }}
        >
          {''}
        </Button>
        <div className="article-list-container">
          <ProjectSelector id={id} />

          <Footer id={id} />
          <AddArticle filters={filters} />
          <ListGroup>
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
        </div>
      </Rnd>
    );
  }
}
export default ArticleList;
