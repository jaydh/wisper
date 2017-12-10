import * as React from 'react';
import ProjectsGraphs from '../containers/graphs/ProjectsGraph';
import SourcesGraphs from '../containers/graphs/SourcesGraph';
import { Grid, Row } from 'react-bootstrap';
class ArticleAnalytics extends React.Component {
  render() {
    return (
      <Grid>
        <ProjectsGraphs />
        <Row>
          <SourcesGraphs />
        </Row>
      </Grid>
    );
  }
}

export default ArticleAnalytics;
