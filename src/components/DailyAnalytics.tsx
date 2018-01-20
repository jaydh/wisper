import * as React from 'react';
import CompletionGraph from '../containers/graphs/DailyCompletionGraphs';
import DailyTrackerGraph from '../containers/graphs/DailyGraph';
import { Container, Row } from 'reactstrap';
class DailyAnalytics extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <DailyTrackerGraph />
        </Row>
        <Row>
          <CompletionGraph />
        </Row>
      </Container>
    );
  }
}

export default DailyAnalytics;
