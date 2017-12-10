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

interface State {
  recentCompletion: any;
  overallCompletion: any;
}

class DailyGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      recentCompletion: this.getCompletionData(props.dailies, true),
      overallCompletion: this.getCompletionData(props.dailies, false)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.dailies.equals(this.props.dailies)) {
      this.setState({
        recentCompletion: this.getCompletionData(nextProps.dailies, true),
        overallCompletion: this.getCompletionData(nextProps.dailies, false)
      });
    }
  }

  getCompletionData(dailies: List<Daily>, recent: boolean) {
    return dailies.map((t: Daily, key: number) => {
      const cutOff = endOfDay(subWeeks(new Date(), 4));
      const completionPercentage =
        recent && !isAfter(t.completedOn.first(), cutOff)
          ? t.completedOn.filter((p: Date) => isAfter(p, cutOff)).size /
            28 *
            100
          : t.completedOn.size /
            (differenceInCalendarDays(new Date(), t.completedOn.first()) + 1) *
            100;
      const data = {
        datasets: [
          {
            label: t.title + recent ? ' recent' : ' overall',
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
    return (
      <div>
        {!dailies.isEmpty() && (
          <div>
            <Row>
              <Col>
                <h2 style={{ textAlign: 'center' }}>
                  Recent Completion Percentage
                </h2>
              </Col>
            </Row>
            <Row>
              {this.state.recentCompletion.map((value: any, key: string) => (
                <Col key={key} xs={6} sm={4} md={3} lg={2}>
                  <Doughnut key={key} data={value[0]} options={value[1]} />
                </Col>
              ))}
            </Row>
            <Row>
              <Col>
                <h2 style={{ textAlign: 'center' }}>
                  Overall Completion Percentage
                </h2>
              </Col>
            </Row>
            <Row>
              {this.state.overallCompletion.map((value: any, key: string) => (
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
    dailies: state.get('dailies')
  };
};

export default connect(mapStateToProps)(DailyGraph);
