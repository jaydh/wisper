import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/visibilityFilter';
import { Button } from 'react-bootstrap';
import { ArticleList as ArticleListType } from '../../constants/StoreState';

interface Props {
  onClick: (t: string) => void;
  currentActive: string;
}

class ActiveSelector extends React.Component<Props> {
  render() {
    const { onClick, currentActive } = this.props;
    const nextActive = ((t: string) => {
      switch (t) {
        case 'Active':
          return 'Completed';
        case 'Completed':
          return 'All';
        default:
          return 'Active';
      }
    })(currentActive);
    return <Button onClick={() => onClick(nextActive)}>{currentActive}</Button>;
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    currentActive: state
      .get('articleLists')
      .find((list: ArticleListType) => list.id === ownProps.id).visibilityFilter
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (filter: string) => {
      dispatch(setVisibilityFilter(filter, ownProps.id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveSelector);
