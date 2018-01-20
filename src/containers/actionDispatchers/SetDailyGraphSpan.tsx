import setDailyGraphSpan from '../../actions/ui/setDailyGraphSpan';
import { connect } from 'react-redux';
import {
  ButtonGroup,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from 'reactstrap';
import * as React from 'react';
import { Daily } from '../../constants/StoreState';
import { List } from 'immutable';
import {
  isBefore,
  isAfter,
  subDays,
  subWeeks,
  startOfDay,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
  endOfToday
} from 'date-fns';

interface Props {
  onSubmit: (min: Date, max: Date) => void;
  currentMax: Date;
  currentMin: Date;
  absMin: Date;
}

class SetDailyGraphSpan extends React.Component<Props> {
  getChoices() {
    let choices: List<Date> = List();
    let iter = new Date();
    while (!isBefore(iter, this.props.absMin)) {
      choices = choices.push(iter);
      iter = subDays(iter, 7);
    }
    iter = subDays(iter, 7);
    return choices.push(iter);
  }

  render() {
    const { onSubmit, currentMax, currentMin } = this.props;
    const choices = this.getChoices();
    const startDate = currentMin ? currentMin : choices.last();
    const endDate = currentMax ? currentMax : new Date();

    return (
      <ButtonGroup>
        <Button onClick={() => onSubmit(startOfToday(), endOfToday())}>
          Today
        </Button>
        <Button onClick={() => onSubmit(startOfYesterday(), endOfYesterday())}>
          Yeserday
        </Button>
        <Button
          onClick={() =>
            onSubmit(startOfDay(subWeeks(startOfToday(), 1)), endOfToday())
          }
        >
          Week
        </Button>
        <Button
          onClick={() =>
            onSubmit(startOfDay(subWeeks(startOfToday(), 2)), endOfToday())
          }
        >
          2 Weeks
        </Button>
        <Button
          onClick={() =>
            onSubmit(startOfDay(subWeeks(startOfToday(), 4)), endOfToday())
          }
        >
          Month
        </Button>
        <Button onClick={() => onSubmit(this.props.absMin, endOfToday())}>
          Full
        </Button>
        <UncontrolledDropdown id="daily-graph-min-selector">
          <DropdownToggle caret={true}>
            Start Date: {startDate.toLocaleDateString()}
          </DropdownToggle>
          <DropdownMenu>
            {choices
              .filter((t: Date) => isBefore(t, currentMax))
              .map((t: Date, key: number) => (
                <DropdownItem
                  key={'daily-graph-min' + t.toLocaleDateString()}
                  onClick={() => onSubmit(t, currentMax)}
                >
                  {t.toLocaleDateString()}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown
          title={'End Date: ' + endDate.toLocaleDateString()}
          id="daily-graph-max-selector"
        >
          <DropdownToggle caret={true}>
            Start Date: {startDate.toLocaleDateString()}
          </DropdownToggle>
          <DropdownMenu>
            {choices
              .filter((t: Date) => isAfter(t, currentMin))
              .map((t: Date) => (
                <DropdownItem
                  key={'daily-graph-max' + t.toLocaleDateString()}
                  onClick={() => onSubmit(currentMin, t)}
                >
                  {t.toLocaleDateString()}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    currentMax: state.get('ui').dailyGraphMax,
    currentMin: state.get('ui').dailyGraphMin,
    absMin: state
      .get('dailies')
      .map((t: Daily) => t.completedOn.first())
      .min()
      ? state
          .get('dailies')
          .map((t: Daily) => t.completedOn.first())
          .min()
      : startOfDay(new Date())
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSubmit: (min: Date, max: Date) => dispatch(setDailyGraphSpan(min, max))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetDailyGraphSpan);
