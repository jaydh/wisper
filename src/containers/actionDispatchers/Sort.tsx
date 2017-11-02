import * as React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import setSortFilter from '../../actions/setSortFilter';
import { connect } from 'react-redux';

interface Props {
  onClick: (t: string) => void;
}

class Sort extends React.Component<Props> {
  render() {
    const { onClick } = this.props;
    return (
      <Dropdown id="bg-nested-dropdown">
        <Dropdown.Toggle noCaret={true}>Sort</Dropdown.Toggle>
        <Dropdown.Menu className="filter-dropdown ">
          <MenuItem
            eventKey="1"
            onClick={() => {
              onClick('date-asc');
            }}
          >
            by date added (recent first)
          </MenuItem>
          <MenuItem
            eventKey="2"
            onClick={() => {
              onClick('date-desc');
            }}
          >
            by date added (recent last)
          </MenuItem>

          <MenuItem eventKey="3" onClick={() => onClick('title')}>
            by title
          </MenuItem>
          <MenuItem eventKey="4" onClick={() => onClick('dateRead')}>
            by date read
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

export default connect(null, mapDispatchToProps)(Sort);
