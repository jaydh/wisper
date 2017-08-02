import * as React from 'react';
import FilterLink from '../containers/FilterLink';

const Footer = () => (
  <p>
    Show: {' '}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>{', '}
    <FilterLink filter="SHOW_ALL">All</FilterLink>
  </p>
);
export default Footer;