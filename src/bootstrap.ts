import { Button, Jumbotron, Navbar } from 'react-bootstrap';
const { bootstrapUtils } = require('react-bootstrap/lib/utils');

export default () => {
  bootstrapUtils.addStyle(Button, 'more');
  bootstrapUtils.addStyle(Button, 'addList');
  bootstrapUtils.addStyle(Button, 'analytics');
  bootstrapUtils.addStyle(Button, 'drag');
  bootstrapUtils.addStyle(Button, 'submit');
  bootstrapUtils.addStyle(Button, 'logout');
  bootstrapUtils.addStyle(Button, 'daily');
  bootstrapUtils.addStyle(Jumbotron, 'canvas');
  bootstrapUtils.addStyle(Button, 'filter');
  bootstrapUtils.addStyle(Navbar, 'nav');
};
