import * as React from 'react';
interface State {
  gitCommit: string;
}

export default class GitInfor extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      gitCommit: ''
    };
  }

  // Gets repository information
  componentDidMount() {
    const that = this;
    fetch('https://api.github.com/repos/jaydh/wispy')
      .then(function(response: any) {
        return response.json();
      })
      .then(function(json: any) {
        that.setState({ gitCommit: json.pushed_at });
      })
      .catch(function(ex: any) {
        console.log('parsing failed', ex);
      });
  }
  render() {
    return (
      <h2 style={{ fontSize: '1em' }}>
        Last updated: {new Date(this.state.gitCommit).toLocaleString()} <br />
        Source code:{' '}
        <a href="https://github.com/jaydh/wispy" target="_blank">
          {'https://github.com/jaydh/wispy'}
        </a>
      </h2>
    );
  }
}
