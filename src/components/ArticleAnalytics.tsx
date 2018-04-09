import * as React from 'react';
import ProjectsGraphs from '../containers/graphs/ProjectsGraph';
import SourcesGraphs from '../containers/graphs/SourcesGraph';
import { Container } from 'reactstrap';
import { pullCompletedArticles } from '../actions/syncWithFirebase';
import { connect } from 'react-redux';

interface Props {
  fetch: () => void;
}

class ArticleAnalytics extends React.Component<Props> {
  componentDidMount() {
    this.props.fetch();
  }
  render() {
    return (
      <Container>
        <ProjectsGraphs />
        <SourcesGraphs />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetch: () => dispatch(pullCompletedArticles())
  };
};

export default connect(null, mapDispatchToProps)(ArticleAnalytics);
