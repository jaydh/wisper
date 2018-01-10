import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/ui/visibilityFilter';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import { ArticleList as ArticleListType } from '../../constants/StoreState';

interface Props {
  onClick: (t: string) => void;
  currentActive: string;
}

class ActiveSelector extends React.Component<Props> {
  render() {
    const { onClick, currentActive } = this.props;
    const options = ['Active', 'Completed', 'Today', 'All'];
    return (
      <DropdownButton id={currentActive} title={currentActive}>
        {options.map((t: string) => (
          <MenuItem
            key={`activeSelector ${t}`}
            onClick={() => onClick(t)}
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
