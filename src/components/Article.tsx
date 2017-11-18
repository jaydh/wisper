import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import { ArticleViewed } from '../actions/articles/articleViewed';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import {
  Glyphicon,
  Collapse,
  ListGroupItem,
  Grid,
  Col,
  ButtonGroup
} from 'react-bootstrap';

interface Props {
  onArticleView: (t: string) => void;
  article: articleType;
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
    const { onArticleView, article } = this.props;

    return (
      <ListGroupItem
        onMouseOver={() => this.setState({ isMenuOpen: true })}
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
      >
        <Grid>
          <Col md={1}>
            {article.fetching && (
              <p>
                <Glyphicon glyph="refresh" />Fetching metadata
              </p>
            )}
            {article.metadata && article.metadata.images ? (
              <div>
                <img
                  src={article.metadata.images[0]}
                  height="70em"
                  style={{
                    position: 'absolute',
                    clip: 'rect(0px,60px,200px,0px)',
                    textAlign: 'center'
                  }}
                />
                <br />
              </div>
            ) : (
              ''
            )}
          </Col>
          <Col md={10}>
            <a
              className="article-link"
              href={article.link}
              target="_blank"
              style={{
                fontSize: '1.7em',
                display: 'inline-block',
                width: '70%'
              }}
              onClick={() => {
                onArticleView(article.id);
              }}
            >
              {article.metadata &&
              (article.metadata.title || article.metadata.ogTitle)
                ? article.metadata.ogTitle || article.metadata.title
                : article.link}
            </a>
            {!article.fetching && article.metadata ? (
              <p style={{ fontSize: '1em' }}>
                {article.metadata.ogSiteName ? article.metadata.ogSiteName : ''}
                {article.metadata.ogDescrption || article.metadata.description}
                <br />
              </p>
            ) : (
              ''
            )}

            <Collapse in={this.state.isMenuOpen}>
              <div>
                <p>
                  Date added: {article.dateAdded} <br />
                  {article.viewedOn
                    ? `Last viewed on ${article.viewedOn
                        .last()
                        .toLocaleString()} - viewed ${article.viewedOn
                        .size} time(s)`
                    : ''}
                  {article.dateRead ? 'Date Read: ' + article.dateRead : ' '}
                </p>
                <AddArticleToProject id={article.id} />
              </div>
            </Collapse>
          </Col>
          <Col md={1}>
            {this.state.isMenuOpen && (
              <ButtonGroup>
                <ToggleArticle id={article.id} />
                <DeleteArticle id={article.id} />
              </ButtonGroup>
            )}
          </Col>
        </Grid>
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
      dispatch(ArticleViewed(articleID));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
