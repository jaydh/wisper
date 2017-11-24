import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import { ArticleViewed } from '../actions/articles/articleViewed';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import {
  Image,
  Glyphicon,
  Collapse,
  ListGroupItem,
  Grid,
  Col,
  ButtonGroup,
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
      isMenuOpen: false,
    };
  }

  render() {
    const { onArticleView, article } = this.props;

    return (
      <ListGroupItem
        onMouseOver={() => this.setState({ isMenuOpen: true })}
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
        onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
      >
        <Grid>
          <Col xs={3} sm={3} md={2} lg={2}>
            {article.metadata && article.metadata.has('images') ? (
              <Image
                src={article.metadata.get('images').get(0)}
                responsive={true}
                thumbnail={true}
              />
            ) : (
              <Image
                src="http://proflikesubstance.scientopia.org/wp-content/uploads/sites/23/2011/02/Box.jpg"
                responsive={true}
                thumbnail={true}
              />
            )}
          </Col>
          <Col xs={8} sm={8} md={9} lg={9}>
            {article.fetching && (
              <p>
                <Glyphicon glyph="refresh" />Fetching metadata
              </p>
            )}
            <a
              className="article-link"
              href={article.link}
              target="_blank"
              style={{
                fontSize: '1.6rem',
              }}
              onClick={() => {
                onArticleView(article.id);
              }}
            >
              {article.metadata
                ? article.metadata.get('ogTitle') ||
                  article.metadata.get('title')
                : article.link}
            </a>
            {!article.fetching && article.metadata ? (
              <p style={{ fontSize: '1.2rem' }}>
                {article.metadata.get('ogSiteName')}
                {article.metadata.get('ogDescrption') ||
                  article.metadata.get('description')}
              </p>
            ) : (
              ''
            )}

            <Collapse in={this.state.isMenuOpen}>
              <div>
                <p>
                  Date added: {article.dateAdded} <br />
                  {!article.viewedOn.isEmpty()
                    ? `Last viewed on ${article.viewedOn
                        .last()
                        .toLocaleString()} - viewed ${
                        article.viewedOn.size
                      } time(s)`
                    : ''}
                  <br />
                  {article.dateRead ? 'Date Read: ' + article.dateRead : ' '}
                  <br />
                </p>
                {article.projects ? (
                  <p>
                    Projects:{' '}
                    {article.projects.valueSeq().map((t: string) => t + ' ')}
                  </p>
                ) : (
                  ''
                )}
                <AddArticleToProject id={article.id} />
              </div>
            </Collapse>
          </Col>
          <Col xs={1} sm={1} md={1} lg={1}>
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
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
