import * as React from 'react';
import { Daily as DailyType } from '../constants/StoreState';
import {
  isSameDay,
  isBefore,
  subDays,
  differenceInCalendarDays,
  getHours,
  getMinutes
} from 'date-fns';
import {
  Button,
  ButtonGroup,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip
} from 'reactstrap';
import { Icon } from 'react-fa';

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
    const avgMinuteOfCompletion =
      daily.completedOn.reduce(
        (acc: number, t: Date) => acc + 60 * getHours(t) + getMinutes(t),
        0
      ) / daily.completedOn.size;

    return (
      <Card>
        <CardHeader>
          <ButtonGroup>
            <Button
              disabled={
                daily.completedOn
                  ? isSameDay(daily.completedOn.last(), new Date())
                  : false
              }
              onClick={() => onComplete()}
              id={'completeDaily' + daily.id}
            >
              {daily.streakCount > 4 && (
                <>
                  {daily.streakCount}
                  <Icon name="fire" />
                </>
              )}
              {daily.completedOn &&
                isBefore(daily.completedOn.last(), subDays(new Date(), 7)) && (
                  <Icon name="exclamation" />
                )}
              {daily.title}
            </Button>
            <UncontrolledTooltip
              placement="bottom"
              target={'completeDaily' + daily.id}
            >
              Complete
            </UncontrolledTooltip>
            <Button
              active={this.state.showDetails}
              id={'Tooltip' + daily.id}
              onClick={() =>
                this.state.showDetails || expand
                  ? this.setState({ showDetails: false })
                  : this.setState({ showDetails: true })
              }
            >
              <Icon name="bar-chart" />
            </Button>
            <UncontrolledTooltip
              placement="right"
              target={'Tooltip' + daily.id}
            >
              Show details
            </UncontrolledTooltip>{' '}
          </ButtonGroup>
        </CardHeader>
        <Collapse isOpen={this.state.showDetails || expand}>
          <CardBody>
            <br />
            Last Completed{' '}
            {differenceInCalendarDays(
              new Date(),
              daily.completedOn.last()
            )}{' '}
            day(s) ago ({daily.completedOn.last().toLocaleDateString()})
            <br />
            Completed {daily.completedOn.size} times <br />
            Started{' '}
            {differenceInCalendarDays(
              new Date(),
              daily.completedOn.first()
            )}{' '}
            days ago <br />
            On average completed at {Math.round(
              avgMinuteOfCompletion / 60
            )}:{Math.round(avgMinuteOfCompletion % 60)}
          </CardBody>
        </Collapse>
      </Card>
    );
  }
}
