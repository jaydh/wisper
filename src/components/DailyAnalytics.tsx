import * as React from 'react';
import CompletionGraph from '../containers/graphs/DailyCompletionGraphs';
import DailyTrackerGraph from '../containers/graphs/DailyGraph';
import { Grid, Row } from 'react-bootstrap';
class DailyAnalytics extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <DailyTrackerGraph />
        </Row>
        <Row>
          <CompletionGraph />
        </Row>
      </Grid>
    );
  }
}

export default DailyAnalytics;
