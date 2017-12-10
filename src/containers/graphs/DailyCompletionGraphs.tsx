import * as React from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';
import {
  endOfDay,
  isAfter,
  subWeeks,
  differenceInCalendarDays
} from 'date-fns';
import { Row, Col } from 'react-bootstrap';

interface Props {
  dailies: List<Daily>;
}

class DailyGraph extends React.Component<Props> {
  render() {
    const { dailies } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <h2 style={{ textAlign: 'center' }}>
              Recent Completion Percentage
            </h2>
          </Col>
        </Row>
        <Row>
          {dailies.map((t: Daily, key: number) => {
            const cutOff = endOfDay(subWeeks(new Date(), 4));
            const completionPercentage = !isAfter(t.completedOn.first(), cutOff)
              ? t.completedOn.filter((p: Date) => isAfter(p, cutOff)).size /
                28 *
                100
              : t.completedOn.size /
                (differenceInCalendarDays(new Date(), t.completedOn.first()) +
                  1) *
                100;
            const data = {
              datasets: [
                {
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
                      callbackData.datasets[0].data[tooltipItem.index].toFixed(
                        2
                      ) + '%'
                    );
                  }
                }
              }
            };

            return (
              <Col key={t.title} xs={6} sm={4} md={3} lg={2}>
                <Doughnut data={data} options={options} />
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col>
            <h2 style={{ textAlign: 'center' }}>
              Overall Completion Percentage
            </h2>
          </Col>
        </Row>
        <Row>
          {dailies.map((t: Daily, key: number) => {
            const completionPercentage =
              t.completedOn.size /
              (differenceInCalendarDays(new Date(), t.completedOn.first()) +
                1) *
              100;
            const data = {
              datasets: [
                {
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
                      callbackData.datasets[0].data[tooltipItem.index].toFixed(
                        2
                      ) + '%'
                    );
                  }
                }
              }
            };

            return (
              <Col key={t.title} xs={6} sm={4} md={3} lg={2}>
                <Doughnut data={data} options={options} />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    dailies: state.get('dailies')
  };
};

export default connect(mapStateToProps)(DailyGraph);
