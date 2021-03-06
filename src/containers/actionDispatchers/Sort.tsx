import * as React from 'react';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';
import setSortFilter from '../../actions/ui/setSortFilter';
import { connect } from 'react-redux';
import { Icon } from 'react-fa';

interface Props {
  onClick: (t: string) => void;
  currentSort: string;
}
interface State {
  isOpen: boolean;
}

class Sort extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    const { onClick, currentSort } = this.props;
    const glyph = ((sort: string) => {
      switch (sort) {
        case 'date-asc':
          return 'sort-amount-asc';
        case 'date-desc':
          return 'sort-amount-desc';
        case 'title':
          return 'sort-amount-asc';
        case 'title-reverse':
          return 'sort-amount-desc';
        case 'dateRead':
          return 'sort-amount-asc';
        case 'dateRead-reverse':
          return 'sort-amount-desc';
        default:
          return '';
      }
    })(currentSort);

    const currentSortString = ((sort: string) => {
      if (sort.startsWith('viewed')) {
        return 'by date viewed';
      }
      if (sort.startsWith('date-')) {
        return 'by date added';
      }
      if (sort.startsWith('title')) {
        return 'by title';
      }
      if (sort.startsWith('date')) {
        return 'by date read';
      }
      if (sort.startsWith('percent')) {
        return 'by read percentage';
      }
      if (sort.startsWith('viewed')) {
        return 'by date viewed';
      }
      return '';
    })(currentSort);
    return (
      <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle>
          Sort {currentSortString} <Icon name={glyph} />
        </DropdownToggle>
        <DropdownMenu>
          {' '}
          <DropdownItem
            onClick={() =>
              currentSort === 'percent'
                ? onClick('percent-reverse')
                : onClick('percent')
            }
          >
            <Icon name={currentSort === 'viewed' ? 'sort-desc' : 'sort-asc'} />{' '}
            Percent
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              currentSort === 'viewed'
                ? onClick('viewed-reverse')
                : onClick('viewed')
            }
          >
            <Icon name={currentSort === 'viewed' ? 'sort-desc' : 'sort-asc'} />{' '}
            Viewed
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              currentSort === 'title'
                ? onClick('title-reverse')
                : onClick('title')
            }
          >
            <Icon name={currentSort === 'title' ? 'sort-desc' : 'sort-asc'} />{' '}
            Title
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              currentSort === 'date-asc'
                ? onClick('date-desc')
                : onClick('date-asc');
            }}
          >
            <Icon
              name={currentSort === 'date-asc' ? 'sort-desc' : 'sort-asc'}
            />{' '}
            Added
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              currentSort === 'dateRead'
                ? onClick('dateRead-reverse')
                : onClick('dateRead')
            }
          >
            <Icon
              name={currentSort === 'dateRead' ? 'sort-desc' : 'sort-asc'}
            />{' '}
            Read
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

function mapDispatchToProps(dispatch: any, ownProps: any) {
  return {
    onClick: (filter: string) => {
      dispatch(setSortFilter(filter));
    }
  };
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    currentSort: state.get('articleLists').sort
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
