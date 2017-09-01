import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../actions/visibilityFilter';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { ArticleList as ArticleListType } from '../constants/StoreState';

interface Props {
  onClick: any;
  currentActive: string;
}

class ActiveSelector extends React.Component<Props> {
  render() {
    const { onClick, currentActive } = this.props;
    const actives = ['Active', 'Completed', 'All'];
    return (
      <DropdownButton
        title={currentActive}
        id="bg-nested-dropdown"
        noCaret={true}
      >
        {actives.map((t: string) => (
          <MenuItem
            key={t}
            eventKey="1"
            onClick={() => {
              onClick(t);
            }}
          >
            {t}
          </MenuItem>
        ))}
      </DropdownButton>
    );
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
