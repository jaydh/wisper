import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/visibilityFilter';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { ArticleList as ArticleListType } from '../../constants/StoreState';

interface Props {
  onClick: (t: string) => void;
  currentActive: string;
}

class ActiveSelector extends React.Component<Props> {
  render() {
    const { onClick, currentActive } = this.props;
    const actives = ['Active', 'Completed', 'All'];
    return (
      <Dropdown id="bg-nested-dropdown">
        <Dropdown.Toggle noCaret={true}>{currentActive}</Dropdown.Toggle>
        <Dropdown.Menu className="filter-dropdown ">
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
        </Dropdown.Menu>
      </Dropdown>
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
