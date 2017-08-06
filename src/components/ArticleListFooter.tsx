import * as React from 'react';
import FilterLink from '../containers/VisibilityFilterLink';

class Footer extends React.Component {
  render() {
    return (
      <div>
        <p>
          Show: <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
          {', '}
          <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
          {', '}
          <FilterLink filter="SHOW_ALL">All</FilterLink>
        </p>
      </div>
    );
  }
}

export default Footer;