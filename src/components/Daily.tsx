import * as React from 'react';
import { Button, Glyphicon, Collapse } from 'react-bootstrap';
import { Daily as DailyType } from '../constants/StoreState';
import { isBefore, subDays, differenceInCalendarDays } from 'date-fns';

interface Props {
  onComplete: () => void;
  daily: DailyType;
  expand: boolean;
}

interface State {
  showDetails: boolean;
}

export default class Daily extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showDetails: props.expand };
  }
  render() {
    const { onComplete, daily, expand } = this.props;
    console.log(expand);
    return (
      <Button
        bsStyle="daily"
        onClick={() => onComplete()}
        onMouseEnter={() =>
          !expand ? this.setState({ showDetails: true }) : null
        }
        onMouseLeave={() =>
          !expand ? this.setState({ showDetails: false }) : null
        }
      >
        {daily.streakCount > 4 && (
          <b>
            {daily.streakCount}
            <Glyphicon glyph="fire" />{' '}
          </b>
        )}
        {daily.completedOn &&
          isBefore(daily.completedOn.last(), subDays(new Date(), 7)) && (
            <b>
              <Glyphicon glyph="warning-sign" />{' '}
            </b>
          )}
        {daily.title}
        <Collapse in={this.state.showDetails || this.props.expand}>
          <p>
            Completed {daily.completedOn.size} times <br />
            Started{' '}
            {differenceInCalendarDays(
              new Date(),
              daily.completedOn.first()
            )}{' '}
            days ago
          </p>
        </Collapse>
      </Button>
    );
  }
}
