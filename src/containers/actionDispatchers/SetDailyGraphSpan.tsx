import setDailyGraphSpan from '../../actions/ui/setDailyGraphSpan';
import { connect } from 'react-redux';
import { Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import * as React from 'react';
import { Daily } from '../../constants/StoreState';
import { List } from 'immutable';
import {
  isBefore,
  isAfter,
  subDays,
  subWeeks,
  startOfDay,
  endOfDay
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
    const absMax = new Date();
    const startDate = currentMin ? currentMin : choices.last();
    const endDate = currentMax ? currentMax : new Date();

    return (
      <Nav justified={true} bsStyle="tabs" bsSize="xsmall">
        <NavItem onClick={() => onSubmit(startOfDay(absMax), endOfDay(absMax))}>
          Today
        </NavItem>
        <NavItem onClick={() => onSubmit(subWeeks(new Date(), 1), absMax)}>
          Week
        </NavItem>
        <NavItem onClick={() => onSubmit(subWeeks(new Date(), 2), absMax)}>
          2 Weeks
        </NavItem>
        <NavItem onClick={() => onSubmit(subWeeks(new Date(), 4), absMax)}>
          Month
        </NavItem>
        <NavItem onClick={() => onSubmit(this.props.absMin, absMax)}>
          Full
        </NavItem>
        <NavDropdown
          title={'Start Date: ' + startDate.toLocaleDateString()}
          id="daily-graph-min-selector"
        >
          {choices
            .filter((t: Date) => isBefore(t, currentMax))
            .map((t: Date, key: number) => (
              <MenuItem
                key={'daily-graph-min' + t.toLocaleDateString()}
                onClick={() => onSubmit(t, currentMax)}
              >
                {t.toLocaleDateString()}
              </MenuItem>
            ))}
        </NavDropdown>
        <NavDropdown
          title={'End Date: ' + endDate.toLocaleDateString()}
          id="daily-graph-max-selector"
        >
          {choices
            .filter((t: Date) => isAfter(t, currentMin))
            .map((t: Date) => (
              <MenuItem
                key={'daily-graph-max' + t.toLocaleDateString()}
                onClick={() => onSubmit(currentMin, t)}
              >
                {t.toLocaleDateString()}
              </MenuItem>
            ))}
        </NavDropdown>
      </Nav>
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
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSubmit: (min: Date, max: Date) => dispatch(setDailyGraphSpan(min, max))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetDailyGraphSpan);
