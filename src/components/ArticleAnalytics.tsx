import * as React from 'react';
import ProjectsGraphs from '../containers/graphs/ProjectsGraph';
import SourcesGraphs from '../containers/graphs/SourcesGraph';
import { Container } from 'reactstrap';
class ArticleAnalytics extends React.Component {
  render() {
    return (
      <Container>
        <ProjectsGraphs />
        <SourcesGraphs />
      </Container>
    );
  }
}

export default ArticleAnalytics;
