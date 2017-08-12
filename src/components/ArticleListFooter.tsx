import * as React from 'react';
import FilterLink from '../containers/VisibilityFilterLink';

class Footer extends React.Component<{ id: string }> {
  render() {
    const { id } = this.props;
    return (
      <div>
        <p>
          Show:{' '}
          <FilterLink filter="SHOW_ACTIVE" id={id}>
            Active
          </FilterLink>
          {', '}
          <FilterLink filter="SHOW_COMPLETED" id={id}>
            Completed
          </FilterLink>
          {', '}
          <FilterLink filter="SHOW_ALL" id={id}>
            All
          </FilterLink>
        </p>
      </div>
    );
  }
}

export default Footer;
