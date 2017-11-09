import * as React from 'react';
import { connect } from 'react-redux';
import { Bubble } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';
import { isAfter, subWeeks } from 'date-fns';

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
                  .filter((p: Date) => isAfter(p, subWeeks(p, 3)))
                  .map((p: Date) => {
                    return {
                      t: p,
                      y: t.title
                    };
                  })
                  .toJS()
              : [],
            backgroundColor: color,
            pointStyle: 'rectRot',
            radius: 8,
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
              source: 'labels',
              fontColor: '#ffffff'
            },
            labels: dailies.map((t: Daily) => t.title).toJS(),
            gridLines: {
              display: true,
              drawBorder: false,
              color: '#f2b632'
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            gridLines: {
              display: true,
              color: '#f2b632'
            },
            ticks: {
              callback: function(tick: any, index: any, array: any) {
                return index % 7 ? '' : tick;
              },
              fontColor: '#ffffff'
            },

            time: {
              max: new Date(),
              round: 'day',
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
