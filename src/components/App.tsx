import * as React from 'react';
import VisibleArticleList from '../containers/VisibleArticleList';
import Logout from './Logout';
import { Button, PageHeader, Jumbotron } from 'react-bootstrap';
import '!!style-loader!css-loader!../css/creative.min.css';
import 'whatwg-fetch';
import { List } from 'immutable';

interface State {
  gitCommit: string;
  articleListIDs: List<number>;
}

class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      gitCommit: 'not available',
      articleListIDs: List([0])
    };
  }
    // Gets repository information
  componentWillMount() {
    let that = this;
    fetch('https://api.github.com/repos/jaydh/wispy')
      .then(function (response: any) {
        return response.json();
      })
      .then(function (json: any) {
        that.setState({ gitCommit: json.updated_at });
      })
      .catch(function (ex: any) {
        console.log('parsing failed', ex);
      });
  }

  addListClick() {
    this.setState({
      articleListIDs: this.state.articleListIDs.push(this.state.articleListIDs.size)
    });
  }

 render() {
    const gitDate = new Date(this.state.gitCommit);
    return (
      <div className="container">
        <PageHeader>
          wispy
        </PageHeader>
        <Button onClick={() => this.addListClick()}>
          Add List
        </Button>
        <Jumbotron>
          {this.state.articleListIDs.map((id) => {
            return <VisibleArticleList key={id} id={id} />;
          })}
        </Jumbotron>
        <Logout />
        <p>
          Under active development <br />
          Last updated: {gitDate.toLocaleString()} <br />
          Github Repo: <a>https://github.com/jaydh/wispy</a>
        </p>
      </div>
    );
  }
}

export default App;
