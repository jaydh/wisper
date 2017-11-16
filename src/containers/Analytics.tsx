import * as React from 'react';
import ProjectsGraphs from './graphs/ProjectsGraph';
import SourcesGraphs from './graphs/SourcesGraph';
import DailyGraphs from './graphs/DailyGraph';
import { Jumbotron } from 'react-bootstrap';

class Analytics extends React.Component {
  render() {
    return (
      <Jumbotron className="canvas">
        <ProjectsGraphs />
        <SourcesGraphs />
        <div style={{ height: '50rem' }}>
          <DailyGraphs />
        </div>
      </Jumbotron>
    );
  }
}

export default Analytics;
