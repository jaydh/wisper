import * as React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Map, List, Set } from 'immutable';
import { Daily } from '../../constants/StoreState';
import {
  differenceInCalendarDays,
  addDays,
  subDays,
  isSameDay,
  isBefore,
  isAfter
} from 'date-fns';
import SetDailyGraphSpan from '../actionDispatchers/SetDailyGraphSpan';

interface Props {
  dailies: List<Daily>;
  graphMin: Date;
  graphMax: Date;
  demoStart: boolean;
  demoComplete: boolean;
  fetching: boolean;
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
      this.setState({
        colorMap: newColorMap
      });
    }
  }

  getData() {
    const { dailies } = this.props;
    const isDayAfter = (a: Date, b: Date) => isSameDay(a, addDays(b, 1));
    const isDayBefore = (a: Date, b: Date) => isSameDay(a, subDays(b, 1));
    let dotDailies: Map<string, List<Date>> = Map();
    dailies.forEach(
      (t: Daily) => (dotDailies = dotDailies.set(t.title, List()))
    );
    let lineDailies: List<{ daily: string; dataset: Set<Date> }> = List();

    dailies.forEach((t: Daily) => {
      let dataset: Set<Date> = Set();

      const iter = t.completedOn.sort().values();
      let current = iter.next();
      let before = current;
      let next = iter.next();
      while (!next.done) {
        if (isDayAfter(next.value, current.value)) {
          dataset = dataset.add(current.value);
        } else if (isDayBefore(before.value, current.value)) {
          dataset = dataset.add(current.value);
          lineDailies = lineDailies.push({ daily: t.title, dataset });
          dataset = dataset.clear();
        } else {
          if (!(dataset.size === 0)) {
            lineDailies = lineDailies.push({ daily: t.title, dataset });
            dataset = dataset.clear();
          }

          dotDailies = dotDailies.set(
            t.title,
            dotDailies.get(t.title).push(current.value)
          );
        }
        before = current;
        current = next;
        next = iter.next();
        if (next.done) {
          if (!isDayBefore(before.value, current.value)) {
            dotDailies = dotDailies.set(
              t.title,
              dotDailies.get(t.title).push(current.value)
            );
          } else {
            dataset = dataset.add(current.value);
          }
          lineDailies = lineDailies.push({
            daily: t.title,
            dataset: dataset
          });
        }
      }
    });

    return {
      datasets: lineDailies
        .map((t: { daily: string; dataset: Set<Date> }, key: number) => {
          const color = this.state.colorMap.get(t.daily);
          return {
            type: 'line',
            label: t.daily + key,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 6,
            pointRadius: 0,
            fill: false,
            pointHoverRadius: 2,
            data: t.dataset
              .filter(
                (p: Date) =>
                  isBefore(p, this.props.graphMax) &&
                  isAfter(p, this.props.graphMin)
              )
              .map((p: Date) => {
                return {
                  x: p,
                  y: t.daily
                };
              })
              .toJS()
          };
        })
        .toJS()
        .concat(
          dotDailies
            .map((value: List<Date>, key: string) => {
              const color = this.state.colorMap.get(key);
              return {
                type: 'bubble',
                label: key + value.size,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 6,
                fill: false,
                data: value
                  .filter(
                    (p: Date) =>
                      isBefore(p, this.props.graphMax) &&
                      isAfter(p, this.props.graphMin)
                  )
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
  }

  getOptions() {
    const { dailies, graphMax, graphMin } = this.props;
    return {
      scales: {
        yAxes: [
          {
            type: 'category',
            labels: [' ']
              .concat(dailies.map((t: Daily) => t.title).toJS())
              .concat([' '])
          }
        ],
        xAxes: [
          {
            type: 'time',
            id: 'streak',
            ticks: {
              callback: function(tick: any, index: any, array: any) {
                return index %
                  Math.round(differenceInCalendarDays(graphMax, graphMin) / 5)
                  ? ''
                  : tick;
              }
            },

            time: {
              max: this.props.graphMax,
              min: this.props.graphMin,
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
            const type = d.datasets[t.datasetIndex].type;
            const streak = d.datasets[t.datasetIndex].data.length;
            return type === 'line' ? '(Streak: ' + streak + ')' : null;
          }
        }
      },
      legend: {
        display: false
      },
      hover: {
        intersect: false,
        mode: 'dataset'
      }
    } as any;
  }

  shouldComponentUpdate() {
    if (
      this.props.fetching ||
      (this.props.demoStart && !this.props.demoComplete)
    ) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        {!this.props.dailies.isEmpty() && (
          <div>
            <Line
              data={this.getData()}
              options={this.getOptions()}
              redraw={true}
            />
            <SetDailyGraphSpan />
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
    graphMax: state.get('ui').dailyGraphMax,
    demoStart: state.get('ui').demoStart,
    demoComplete: state.get('ui').demoComplete,
    fetching: state.get('ui').fetchingDailies
  };
};

export default connect(mapStateToProps)(DailyGraph);
