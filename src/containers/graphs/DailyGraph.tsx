import * as React from 'react';
import { connect } from 'react-redux';
import { Bubble } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';

const Colors = [
  '#F9ED69',
  '#F08A5D',
  '#B83B5E',
  '#6A2C70',
  '#08D9D6',
  '#252A34',
  '#FF2E63',
  '#7AC7C4',
  '#F73859',
  '#FFCFDF',
  '#FEFDCA',
  '#E0F9B5',
  '#A5DEE5'
];

interface Props {
  dailies: List<Daily>;
}

class DailyGraph extends React.Component<Props> {
  render() {
    const dynamicColors = function() {
      return Colors[Math.floor(Math.random() * Colors.length)];
    };
    const { dailies } = this.props;
    const data = {
      labels: dailies.map((t: Daily) => t.title).toJS(),
      datasets: dailies
        .map((t: Daily) => {
          const color = dynamicColors();
          return {
            data: t.completedOn? t.completedOn
              .map((p: Date) => {
                return {
                  x: p,
                  y: t.title
                };
              })
              .toJS(): [],
            backgroundColor: color,
            pointStyle: 'rectRounded',
            radius: 10
          };
        })
        .toJS()
    };
    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            type: 'category',
            labels: dailies.map((t: Daily) => t.title).toJS(),
            gridLines: {
              display: true,
              drawBorder: false,
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            gridLines: {
              display: true
            },
            time: {
              // Last two weeks
              min: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDay() / 4 - 2,
                1
              ),
              unit: 'day',
              stepSize: 1,
              categorySpacing: 0,
              displayFormats: {
                millisecond: 'MMM DD',
                second: 'MMM DD',
                minute: 'MMM DD',
                hour: 'MMM DD',
                day: 'MMM DD',
                week: 'MMM DD',
                month: 'MMM DD',
                quarter: 'MMM DD',
                year: 'MMM DD'
              }
            }
          }
        ]
      },
      title: {
        display: true,
        text: 'Dailies completed'
      },
      legend: {
        display: false
      }
    } as any;

    return (
      <div>
        <Bubble data={data} options={options} width={100} height={200} />
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
