import * as React from 'react';
import ProjectsGraphs from '../containers/graphs/ProjectsGraph';
import SourcesGraphs from '../containers/graphs/SourcesGraph';
import { Container, Row } from 'reactstrap';
class ArticleAnalytics extends React.Component {
  render() {
    return (
      <Container>
        <ProjectsGraphs />
        <Row>
          <SourcesGraphs />
        </Row>
      </Container>
    );
  }
}

export default ArticleAnalytics;
