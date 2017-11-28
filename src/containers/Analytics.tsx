import * as React from 'react';
import ProjectsGraphs from './graphs/ProjectsGraph';
import SourcesGraphs from './graphs/SourcesGraph';
import { Grid, Row } from 'react-bootstrap';
class Analytics extends React.Component {
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

export default Analytics;
