import * as React from 'react';
import { connect } from 'react-redux';
import { setArticleListView } from '../../actions/ui/articleList';
import { Button, Badge } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  currentView: string;
  onClick: (t: string) => void;
  articlesSize: number;
}

class SetArticleListView extends React.Component<Props> {
  render() {
    return (
      <Button
        type="button"
        onClick={() =>
          this.props.currentView === 'compact'
            ? this.props.onClick('full')
            : this.props.onClick('compact')
        }
      >
        {' '}
        <Icon
          name={
            this.props.currentView === 'compact' ? 'th-list' : 'align-justify'
          }
        />{' '}
        <Badge>
          <Icon name="list-alt" /> {this.props.articlesSize}
        </Badge>
      </Button>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    currentView: state.get('articleLists').view
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (t: string) => {
      dispatch(setArticleListView(t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetArticleListView);
