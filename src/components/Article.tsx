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
  ButtonGroup
} from 'react-bootstrap';
import LazyLoad from 'react-lazyload';

interface Props {
  onArticleView: (t: string) => void;
  article: articleType;
  compact: boolean;
}
interface State {
  isMenuOpen: boolean;
  hoverable: boolean;
}

class Article extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      hoverable: false
    };
  }

  render() {
    const { onArticleView, article, compact } = this.props;
    const hasTitle = article.metadata
      ? article.metadata.has('title') || article.metadata.has('oGtitle')
      : false;
    const hasDescription = article.metadata
      ? article.metadata.has('description') ||
        article.metadata.has('ogDescrption')
      : false;
    const hasSiteName = article.metadata
      ? article.metadata.has('siteName') || article.metadata.has('ogSiteName')
      : false;

    const showImage = !compact || this.state.isMenuOpen;

    return (
      <ListGroupItem
        onMouseEnter={() =>
          this.setState({ hoverable: true, isMenuOpen: true })
        }
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
        onTouchEnd={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
      >
        <LazyLoad height="300" offset={400} overflow={false}>
          <Grid>
            {showImage && (
              <Col xs={2} sm={2} md={2} lg={2}>
                {article.metadata && article.metadata.has('images') ? (
                  <Image
                    src={article.metadata.get('images').get(0)}
                    responsive={true}
                    thumbnail={true}
                  />
                ) : (
                  ''
                )}
              </Col>
            )}
            <Col
              xs={showImage ? 8 : 10}
              sm={showImage ? 8 : 10}
              md={showImage ? 9 : 11}
              lg={showImage ? 9 : 11}
            >
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
                  fontSize: '1.6rem'
                }}
                onClick={() => {
                  onArticleView(article.id);
                }}
              >
                {hasTitle
                  ? article.metadata.get('ogTitle') ||
                    article.metadata.get('title')
                  : article.link}
              </a>
              <p
                style={
                  this.state.isMenuOpen
                    ? {
                        fontSize: '1.2rem'
                      }
                    : {
                        fontSize: '1.2rem'
                      }
                }
              >
                {hasSiteName
                  ? article.metadata.get('siteName') ||
                    article.metadata.get('ogSiteName')
                  : ''}
                {hasSiteName && hasDescription ? '- ' : ''}
                {hasDescription
                  ? article.metadata.get('ogDescrption') ||
                    article.metadata.get('description')
                  : ''}
              </p>
              <Collapse in={this.state.isMenuOpen}>
                <div>
                  <p>
                    {article.dateAdded ? (
                      <small>
                        Date added: {article.dateAdded.toLocaleDateString()}{' '}
                        <br />
                      </small>
                    ) : (
                      ''
                    )}
                    {!article.viewedOn.isEmpty() ? (
                      <small>
                        {`Last viewed on ${article.viewedOn
                          .last()
                          .toLocaleString()}
                        - viewed ${article.viewedOn.size} time(s)`}
                        <br />
                      </small>
                    ) : (
                      ''
                    )}
                    {article.dateRead ? (
                      <small>
                        {'Date Read: ' + article.dateRead.toLocaleDateString()}
                        <br />
                      </small>
                    ) : (
                      ' '
                    )}
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
            <Col xs={2} sm={2} md={1} lg={1} mdOffset={9} lgOffset={9}>
              {this.state.isMenuOpen && (
                <ButtonGroup>
                  <ToggleArticle id={article.id} />
                  <DeleteArticle id={article.id} />
                </ButtonGroup>
              )}
            </Col>
          </Grid>
        </LazyLoad>
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
