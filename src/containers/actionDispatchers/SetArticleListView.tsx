import * as React from 'react';
import { connect } from 'react-redux';
import { setArticleListView } from '../../actions/ui/articleList';
import { Button, Glyphicon } from 'react-bootstrap';
import { ArticleList } from '../../constants/StoreState';

export interface Props {
  currentView: string;
  onClick: (t: string) => void;
}

class SetArticleListView extends React.Component<Props, {}> {
  render() {
    return (
      <Button
        type="button"
        bsStyle="filter"
        onClick={() =>
          this.props.currentView === 'compact'
            ? this.props.onClick('full')
            : this.props.onClick('compact')
        }
      >
        {' '}
        <Glyphicon
          glyph={
            this.props.currentView === 'compact' ? 'th-list' : 'align-justify'
          }
        />
      </Button>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    currentView: state
      .get('articleLists')
      .find((t: ArticleList) => t.id === ownProps.id).view
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (t: string) => {
      dispatch(setArticleListView(ownProps.id, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetArticleListView);
