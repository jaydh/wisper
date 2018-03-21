import * as React from 'react';
import { connect } from 'react-redux';
import updateHTML from '../../actions/articles/updateHTML';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Icon } from 'react-fa';
import { Set } from 'immutable';
import { Article } from '../../constants/StoreState';

interface Props {
  onSaveClick: () => void;
  articles: Set<Article>;
}

class SaveArticle extends React.Component<Props> {
  render() {
    const { onSaveClick } = this.props;
    return (
      <>
        <Button id="saveArticles" onClick={() => onSaveClick()}>
          <Icon name="save" />
        </Button>
        <UncontrolledTooltip placement="bottom" target="saveArticles">
          Save current articles
        </UncontrolledTooltip>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onSaveClick: () =>
      ownProps.articles.map(
        (t: Article) => (!t.HTMLContent ? dispatch(updateHTML(t.id)) : null)
      )
  };
};

export default connect(null, mapDispatchToProps)(SaveArticle);
