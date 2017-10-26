import * as React from 'react';
import { connect } from 'react-redux';
import { Bubble } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';

const Colors = [
  '#7F7EFF',
  '#ED254E',
  '#7D4E57',
  '#EF798A',
  '#CCFBFE',
  '#8D6A9F',
  '#00A9A5',
  '#C4F1BE',
  '#F1DEDE',
  '#E36397',
  '#577399',
  '#1B998B'
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
      datasets: dailies
        .map((t: Daily) => {
          const color = dynamicColors();
          return {
            data: t.completedOn
              ? t.completedOn
                  .map((p: Date) => {
                    return {
                      t: p,
                      y: t.title
                    };
                  })
                  .toJS()
              : [],
            backgroundColor: color,
            pointStyle: 'circle',
            radius: 5,
            label: t.title
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
            ticks: {
              source: 'labels'
            },
            labels: dailies.map((t: Daily) => t.title).toJS(),
            gridLines: {
              display: true,
              drawBorder: false,
              color: '#577399'
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            gridLines: {
              display: true,
              color: '#1290bf'
            },
            ticks: {
              autoskip: true,
              callback: function(tick: any, index: any, array: any) {
                return index % 3 ? '' : tick;
              }
            },

            time: {
              // Last two weeks
              min: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDay() / 4 - 2,
                1
              ),
              max: new Date(),
              unit: 'day',
              stepSize: 1,
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
      },
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {
            return '(Date:' + t.xLabel + ')';
          }
        }
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
