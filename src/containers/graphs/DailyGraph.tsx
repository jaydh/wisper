import * as React from 'react';
import setDailyGraphSpan from '../../actions/ui/setDailyGraphSpan';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Map, List, Set } from 'immutable';
import { Daily } from '../../constants/StoreState';
import {
  addDays,
  subDays,
  isSameDay,
  isBefore,
  isAfter,
  parse,
  startOfDay,
  endOfDay
} from 'date-fns';
import SetDailyGraphSpan from '../actionDispatchers/SetDailyGraphSpan';

interface Props {
  dailies: List<Daily>;
  graphMin: Date;
  graphMax: Date;
  demoStart: boolean;
  demoComplete: boolean;
  fetching: boolean;
  absMin: Date;
  onPointClick: (min: Date, max: Date) => void;
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

  shouldComponentUpdate(nextProps: Props) {
    if (
      nextProps.fetching ||
      (nextProps.demoStart && !nextProps.demoComplete)
    ) {
      return false;
    }
    return true;
  }

  getData() {
    const dailies = this.props.dailies.filter((t: Daily) => !t.finalized);
    const graphMax = this.props.graphMax
      ? endOfDay(this.props.graphMax)
      : endOfDay(new Date());
    const graphMin = this.props.graphMin
      ? endOfDay(this.props.graphMin)
      : endOfDay(this.props.absMin);
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
            type: isSameDay(graphMax, graphMin) ? 'bubble' : 'line',
            label: t.daily + ' line graph ' + key,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 6,
            pointRadius: 0,
            fill: false,
            pointHoverRadius: 2,
            data: t.dataset
              .filter(
                (p: Date) =>
                  isBefore(p, addDays(graphMax, 1)) &&
                  isAfter(p, subDays(graphMin, 1))
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
                label: key + 'bubble graph ' + value.size,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 6,
                fill: false,
                data: value
                  .filter(
                    (p: Date) =>
                      isBefore(p, addDays(graphMax, 1)) &&
                      isAfter(p, subDays(graphMin, 1))
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
    const dailies = this.props.dailies.filter((t: Daily) => !t.finalized);
    const graphMax = this.props.graphMax ? this.props.graphMax : new Date();
    const graphMin = this.props.graphMin
      ? this.props.graphMin
      : this.props.absMin;
    return {
      scales: {
        yAxes: [
          {
            type: 'category',
            labels: dailies.map((t: Daily) => t.title).toJS()
          }
        ],
        xAxes: [
          {
            type: 'time',
            ticks: {
              callback: (tick: any, index: any, array: any) => {
                if (
                  array[index] &&
                  isSameDay(
                    parse(array[0].value),
                    parse(array[array.length - 1].value)
                  )
                ) {
                  return index % Math.round(array.length / 6) === 0
                    ? parse(array[index].value).toLocaleTimeString()
                    : '';
                }
                return index % Math.round(array.length / 5) ? '' : tick;
              }
            },

            time: {
              max: graphMax,
              min: graphMin,
              round: isSameDay(graphMin, graphMax) ? 'minute' : 'day',
              unit: isSameDay(graphMin, graphMax) ? 'hour' : 'day',
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
        text:
          'Dailies completed (' +
          graphMin.toLocaleDateString() +
          ' - ' +
          graphMax.toLocaleDateString() +
          ')'
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

  render() {
    return (
      <div>
        {!this.props.dailies.isEmpty() && (
          <div>
            <Line
              data={this.getData()}
              options={this.getOptions()}
              getElementAtEvent={(e: any) => {
                if (e[0]) {
                  const event = e[0];
                  const dataPoint =
                    e[0]._chart.chart.controller.config.data.datasets[
                      event._datasetIndex
                    ].data[event._index].x;

                  const date = parse(dataPoint);
                  this.props.onPointClick(startOfDay(date), endOfDay(date));
                }
              }}
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
    fetching: state.get('ui').fetchingDailies,
    absMin: state
      .get('dailies')
      .map((t: Daily) => t.completedOn.first())
      .min()
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onPointClick: (min: Date, max: Date) => {
      dispatch(setDailyGraphSpan(min, max));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyGraph);
