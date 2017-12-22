import setDailyGraphSpan from '../../actions/ui/setDailyGraphSpan';
import { connect } from 'react-redux';
import { Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import * as React from 'react';
import { Daily } from '../../constants/StoreState';
import { List } from 'immutable';
import { isBefore, isAfter, subDays, subWeeks } from 'date-fns';

interface Props {
  onSubmit: (min: Date, max: Date) => void;
  currentMax: Date;
  currentMin: Date;
  dailyMins: List<Date>;
}

class SetDailyGraphSpan extends React.Component<Props> {
  getChoices() {
    let absMin = this.props.dailyMins.get(0);
    this.props.dailyMins.forEach((t: Date) => {
      if (isBefore(t, absMin)) {
        absMin = t;
      }
    });
    let choices: List<Date> = List();
    let iter = new Date();
    while (!isBefore(iter, absMin)) {
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
    return (
      <Nav justified={true} bsStyle="tabs" bsSize="xsmall">
        <NavItem
          bsStyle="daily"
          onClick={() => onSubmit(subWeeks(new Date(), 1), new Date())}
        >
          Week
        </NavItem>
        <NavItem
          bsStyle="daily"
          onClick={() => onSubmit(subWeeks(new Date(), 2), new Date())}
        >
          2 Weeks
        </NavItem>
        <NavItem
          bsStyle="daily"
          onClick={() => onSubmit(subWeeks(new Date(), 4), new Date())}
        >
          Month
        </NavItem>
        <NavItem
          bsStyle="daily"
          onClick={() => onSubmit(choices.last(), new Date())}
        >
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
          title={'End Date: ' + currentMax.toLocaleDateString()}
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
