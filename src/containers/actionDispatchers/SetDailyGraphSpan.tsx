import setDailyGraphSpan from '../../actions/ui/setDailyGraphSpan';
import { connect } from 'react-redux';
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import * as React from 'react';
import { Daily } from '../../constants/StoreState';
import { List } from 'immutable';
import { isBefore, isAfter, isSameDay, subDays, addDays } from 'date-fns';

interface Props {
  onSubmit: (min: Date, max: Date) => void;
  currentMax: Date;
  currentMin: Date;
  dailyMins: List<Date>;
}

interface State {
  absMin: Date;
  choices: List<string>;
}

class SetDailyGraphSpan extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let absMin = props.dailyMins.get(0);
    props.dailyMins.forEach((t: Date) => {
      if (isBefore(t, absMin)) {
        absMin = t;
      }
    });
    let choices: List<string> = List();
    let iter = new Date();
    while (!isSameDay(iter, absMin)) {
      choices = choices.push(iter.toLocaleDateString());
      iter = subDays(iter, 1);
    }
    this.state = { absMin, choices };
  }

  componentWillReceiveProps(props: Props) {
    let absMin = props.dailyMins.get(0);
    props.dailyMins.forEach((t: Date) => {
      if (isBefore(t, absMin)) {
        absMin = t;
      }
    });
    let choices: List<string> = List();
    let iter = new Date();
    while (!isBefore(iter, absMin)) {
      choices = choices.push(iter.toLocaleDateString());
      iter = subDays(iter, 7);
    }
    iter = subDays(iter, 7);
    choices.push(iter.toLocaleDateString());

    this.setState({ absMin, choices });
  }

  render() {
    const { onSubmit, currentMax, currentMin } = this.props;
    return (
      <ButtonGroup>
        <DropdownButton
          title={
            currentMin
              ? currentMin.toLocaleDateString()
              : this.state.absMin.toLocaleDateString()
          }
          id="daily-graph-min-selector"
        >
          {this.state.choices
            .filter((t: string) => isBefore(new Date(t), currentMax))
            .map((t: string) => (
              <MenuItem
                key={'daily-graph-min' + t}
                onClick={() => onSubmit(new Date(t), currentMax)}
              >
                {t}
              </MenuItem>
            ))}
        </DropdownButton>
        <DropdownButton
          title={currentMax.toLocaleDateString()}
          id="daily-graph-max-selector"
        >
          {this.state.choices
            .filter((t: string) => isAfter(new Date(t), currentMin))
            .map((t: string) => (
              <MenuItem
                key={'daily-graph-max' + t}
                onClick={() => onSubmit(currentMin, addDays(new Date(t), 1))}
              >
                {t}
              </MenuItem>
            ))}
        </DropdownButton>
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    currentMax: state.get('ui').dailyGraphMax,
    currentMin: state.get('ui').dailyGraphMin,
    dailyMins: state
      .get('dailies')
      .map((t: Daily) => t.completedOn.first())
      .toList()
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSubmit: (min: Date, max: Date) => dispatch(setDailyGraphSpan(min, max))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetDailyGraphSpan);
