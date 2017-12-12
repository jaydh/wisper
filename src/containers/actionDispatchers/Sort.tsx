import * as React from 'react';
import { Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import setSortFilter from '../../actions/setSortFilter';
import { connect } from 'react-redux';
import { ArticleList } from '../../constants/StoreState';

interface Props {
  onClick: (t: string) => void;
  currentSort: string;
}

class Sort extends React.Component<Props> {
  render() {
    const { onClick, currentSort } = this.props;
    const glyph = (function(sort: string) {
      switch (sort) {
        case 'date-asc':
          return 'sort-by-order';
        case 'date-desc':
          return 'sort-by-order-alt';
        case 'title':
          return 'sort-by-alphabet';
        case 'title-reverse':
          return 'sort-by-alphabet-alt';
        case 'dateRead':
          return 'sort-by-attributes';
        case 'dateRead-reverse':
          return 'sort-by-attributes-alt';
        default:
          return '';
      }
    })(currentSort);
    return (
      <Dropdown id="bg-nested-dropdown">
        <Dropdown.Toggle>
          Sort <Glyphicon glyph={glyph} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-dropdown ">
          <MenuItem
            onClick={() =>
              currentSort === 'title'
                ? onClick('title-reverse')
                : onClick('title')
            }
          >
            <Glyphicon
              glyph={
                currentSort === 'title'
                  ? 'sort-by-alphabet-alt'
                  : 'sort-by-alphabet'
              }
            />{' '}
            Title
          </MenuItem>
          <MenuItem
            onClick={() => {
              currentSort === 'date-asc'
                ? onClick('date-desc')
                : onClick('date-asc');
            }}
          >
            <Glyphicon
              glyph={
                currentSort === 'date-asc'
                  ? 'sort-by-order-alt'
                  : 'sort-by-order'
              }
            />{' '}
            Added
          </MenuItem>
          <MenuItem
            onClick={() =>
              currentSort === 'dateRead'
                ? onClick('dateRead-reverse')
                : onClick('dateRead')
            }
          >
            <Glyphicon
              glyph={
                currentSort === 'dateRead'
                  ? 'sort-by-attributes-alt'
                  : 'sort-by-attributes'
              }
            />{' '}
            Read
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

function mapDispatchToProps(dispatch: any, ownProps: any) {
  return {
    onClick: (filter: string) => {
      dispatch(setSortFilter(filter, ownProps.id));
    }
  };
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    currentSort: state
      .get('articleLists')
      .find((t: ArticleList) => t.id === ownProps.id).sort
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
