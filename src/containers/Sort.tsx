import * as React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { sortArticles } from '../actions/sortArticles';
import { connect } from 'react-redux';

interface Props {
  onClick: any;
}

class Sort extends React.Component<Props> {
  render() {
    const { onClick } = this.props;
    return (
      <DropdownButton
        title="Sort"
        id="bg-nested-dropdown"
        noCaret={true}
      >
        <MenuItem
          eventKey="1"
          onClick={() => {
            onClick('date');
          }}
        >
          by date added
        </MenuItem>
        <MenuItem eventKey="2" onClick={() => onClick('title')}>
          by title
        </MenuItem>
        <MenuItem eventKey="3" onClick={() => onClick('dateRead')}>
          by date read
        </MenuItem>
      </DropdownButton>
    );
  }
}

function mapDispatchToProps(dispatch: any, ownProps: any) {
  return {
    onClick: (filter: string) => {
      dispatch(sortArticles(filter));
    }
  };
}

export default connect(null, mapDispatchToProps)(Sort);
