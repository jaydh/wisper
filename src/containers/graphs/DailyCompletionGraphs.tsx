import * as React from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';
import {
  isAfter,
  differenceInCalendarDays,
  isBefore,
  isSameDay
} from 'date-fns';
import { Row, Col } from 'reactstrap';

interface Props {
  dailies: List<Daily>;
  graphMin: Date;
  graphMax: Date;
}

class DailyGraph extends React.Component<Props> {
  getCompletionData() {
    return this.props.dailies
      .filter((t: Daily) => !t.finalized)
      .map((t: Daily, key: number) => {
        const graphMax = this.props.graphMax ? this.props.graphMax : new Date();
        const graphMin = isBefore(this.props.graphMin, t.completedOn.first())
          ? t.completedOn.first()
          : this.props.graphMin;
        const filterData = t.completedOn.filter(
          (p: Date) =>
            (isBefore(p, graphMax) && isAfter(p, graphMin)) ||
            isSameDay(p, graphMax) ||
            isSameDay(p, graphMin)
        );
        const completionPercentage =
          filterData.size /
          (differenceInCalendarDays(graphMax, graphMin) + 1) *
          100;
        const data = {
          datasets: [
            {
              label: t.title,
              data: [completionPercentage, 100 - completionPercentage],
              backgroundColor: ['#60a5f3', '#FFFFFF']
            }
          ],
          labels: ['Completion Percentage', 'Incompletion Percentage']
        };
        const options = {
          title: {
            display: true,
            text: t.title
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem: any, callbackData: any) {
                return (
                  callbackData.datasets[0].data[tooltipItem.index].toFixed(2) +
                  '%'
                );
              }
            }
          }
        };
        return [data, options];
      });
  }

  render() {
    const { dailies } = this.props;
    const completionData = this.getCompletionData() as any;

    return (
      <div>
        {!dailies.isEmpty() && (
          <div>
            <Row>
              <Col>
                <h2 style={{ textAlign: 'center' }}>Completion Percentage</h2>
              </Col>
            </Row>
            <Row>
              {completionData.map((value: any, key: string) => (
                <Col key={key} xs={6} sm={4} md={3} lg={2}>
                  <Doughnut key={key} data={value[0]} options={value[1]} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    dailies: state.get('dailies'),
    graphMin: state.get('ui').dailyGraphMin,
    graphMax: state.get('ui').dailyGraphMax
  };
};

export default connect(mapStateToProps)(DailyGraph);
