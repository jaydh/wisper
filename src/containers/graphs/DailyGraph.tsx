import * as React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Map, List } from 'immutable';
import { Daily } from '../../constants/StoreState';
import { endOfDay, subDays, isSameDay, isAfter, subWeeks } from 'date-fns';

interface Props {
  dailies: List<Daily>;
}

interface State {
  colors: List<string>;
  colorMap: Map<string, string>;
}
class DailyGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let colors = List([
      '#7F7EFF',
      '#ED254E',
      '#7D4E57',
      '#EF798A',
      '#8D6A9F',
      '#00A9A5',
      '#E36397',
      '#577399',
      '#1B998B'
    ])
      .sortBy(Math.random)
      .toList();
    let colorMap: Map<string, string> = Map();
    props.dailies.forEach((t: Daily) => {
      const index = Math.floor(Math.random() * colors.size);
      const color = colors.get(index);
      colors = colors.remove(index);
      colorMap = colorMap.set(t.title, color);
    });

    this.state = {
      colors: colors,
      colorMap: colorMap
    };
  }
  dynamicColors() {
    const index = Math.floor(Math.random() * this.state.colors.size);
    const color = this.state.colors.get(index);
    const newCo = this.state.colors.remove(index);
    this.setState({ colors: newCo });
    return color;
  }
  componentWillReceiveProps(nextProps: Props) {
    if (
      !this.props.dailies
        .map((t: Daily) => t.title)
        .equals(nextProps.dailies.map((t: Daily) => t.title))
    ) {
      let newColorMap: Map<string, string> = Map();
      nextProps.dailies.forEach((t: Daily) => {
        newColorMap = newColorMap.set(t.title, this.dynamicColors());
      });
      this.setState({ colorMap: newColorMap });
    }
  }

  render() {
    let { dailies } = this.props;
    const cutOff = endOfDay(subWeeks(new Date(), 4));
    const onStreak = (a: Date, b: Date) => isSameDay(a, subDays(b, 1));

    let dotDailies: Map<string, List<Date>> = Map();
    dailies.forEach(
      (t: Daily) => (dotDailies = dotDailies.set(t.title, List()))
    );

    const lineDailies = dailies
      .map((t: any) => {
        let datasets: List<List<Date>> = List();
        let index = 0;
        t.completedOn.forEach((p: Date) => {
          if (!datasets.get(index)) {
            datasets = datasets.set(index, List());
          }
          const next = t.completedOn.get(t.completedOn.indexOf(p) + 1);
          if (onStreak(p, next)) {
            datasets = datasets.set(
              index,
              datasets
                .get(index)
                .push(p)
                .push(next)
            );
          } else {
            index++;
            dotDailies = dotDailies.set(
              t.title,
              dotDailies.get(t.title).push(p)
            );
          }
        });
        return datasets.map((d: List<Date>) => {
          return { label: t.title, data: d };
        });
      })
      .flatten();
    const data = {
      datasets: lineDailies
        .map((t: any, key: number) => {
          const cutOffData = t.data
            ? t.data.filter((p: Date) => isAfter(p, cutOff))
            : List();
          const color = this.state.colorMap.get(t.label);
          return {
            type: 'line',
            label: t.label + key,
            backgroundColor: color,
            pointWidth: 0,
            borderColor: color,
            borderWidth: 6,
            pointRadius: 0,
            fill: false,
            data: cutOffData
              .map((p: Date) => {
                return {
                  x: p,
                  y: t.label
                };
              })
              .toJS()
          };
        })
        .toJS()
        .concat(
          dotDailies
            .map((value: List<Date>, key: string) => {
              const cutOffData = value.filter((p: Date) => isAfter(p, cutOff));
              const color = this.state.colorMap.get(key);
              return {
                type: 'bubble',
                label: key + value.size,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 6,
                fill: false,
                data: cutOffData
                  .map((p: Date) => {
                    return {
                      x: p,
                      y: key
                    };
                  })
                  .toJS()
              };
            })
            .toList()
            .toJS()
        )
    };
    const options = {
      scales: {
        yAxes: [
          {
            type: 'category',
            labels: dailies.map((t: Daily) => t.title).toJS(),
            gridLines: {
              display: true,
              color: '#f2b632'
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            id: 'streak',
            gridLines: {
              display: true,
              color: '#f2b632'
            },
            ticks: {
              callback: function(tick: any, index: any, array: any) {
                return index % 7 ? '' : tick;
              }
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
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {
            return '(Date:' + t.xLabel + ')';
          }
        }
      },
      legend: {
        display: false
      }
    } as any;

    return <Line data={data} options={options} />;
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    dailies: state.get('dailies')
  };
};

export default connect(mapStateToProps)(DailyGraph);
