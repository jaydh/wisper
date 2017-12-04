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
import { Col } from 'react-bootstrap';

let Colors = List([
  '#7F7EFF',
  '#ED254E',
  '#7D4E57',
  '#EF798A',
  '#CCFBFE',
  '#8D6A9F',
  '#00A9A5',
  '#C4F1BE',
  '#E36397',
  '#577399',
  '#1B998B'
]);

interface Props {
  dailies: List<Daily>;
}

interface State {
  colors: List<string>;
}
class DailyGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      colors: this.props.dailies
        .map((t: any) => {
          const color = this.dynamicColors();
          return color;
        })
        .toList()
    };
  }
  dynamicColors = function() {
    return Colors.get(Math.floor(Math.random() * Colors.size));
  };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      colors: nextProps.dailies
        .map((t: any) => {
          const color = this.dynamicColors();
          return color;
        })
        .toList()
    });
  }
  render() {
    const { dailies } = this.props;
    return (
      <div>
        {dailies.map((t: Daily, key: number) => {
          // const color = this.state.colors.get(key);
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
            }
          };

          return (
            <Col key={t.title} xs={6} sm={4} md={3} lg={2}>
              <Doughnut data={data} options={options} />
            </Col>
          );
        })}
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
