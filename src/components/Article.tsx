import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import { ArticleViewed } from '../actions/articles/articleViewed';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import {
  Glyphicon,
  Button,
  ButtonGroup,
  Collapse,
  ListGroupItem
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
      <ListGroupItem>
        <ButtonGroup
          style={{
            position: 'absolute',
            right: '1em',
            width: '5em',
            height: '5em'
          }}
        >
          <ToggleArticle id={article.id} />
          <Button
            bsStyle="more"
            onClick={() =>
              this.setState({ isMenuOpen: !this.state.isMenuOpen })}
          >
            <Glyphicon glyph="menu-hamburger" />
          </Button>
        </ButtonGroup>

        {article.fetching && <Glyphicon glyph="refresh" />}
        <a
          className="article-link"
          href={article.link}
          target="_blank"
          style={{ display: 'inline-block', width: '70%' }}
          onClick={() => {
            onArticleView(article.id);
          }}
        >
          {article.metadata &&
          (article.metadata.title || article.metadata.ogTitle)
            ? article.metadata.ogTitle || article.metadata.title
            : article.link}
        </a>

        <Collapse in={this.state.isMenuOpen}>
          <div className="articleInfo">
            {!article.fetching && article.metadata ? (
              <p>
                {article.metadata.ogDescrption || article.metadata.description}
                <br />
                {article.metadata.ogSiteName
                  ? `Domain: ${article.metadata.ogSiteName}`
                  : ''}
              </p>
            ) : (
              'Fetching metadata'
            )}
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
            <DeleteArticle id={article.id} />
          </div>
        </Collapse>
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
