import * as React from 'react';
import { connect } from 'react-redux';
import completeDaily from '../actions/dailies/completeDaily';
import Daily from '../components/Daily';
import { Daily as DailyType } from '../constants/StoreState';
import { List } from 'immutable';
import { isBefore, subDays, isSameDay } from 'date-fns';
import { Icon } from 'react-fa';
import { CardDeck, Button, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<DailyType>;
}

interface State {
  expand: boolean;
  showCompleted: boolean;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { expand: false, showCompleted: false };
  }
  render() {
    const { onComplete, dailies } = this.props;
    const activeDailies = dailies
      .filter((t: DailyType) => !t.finalized)
      .filter((t: DailyType) => {
        return t.completedOn && !t.completedOn.isEmpty()
          ? this.state.showCompleted ||
              !isSameDay(t.completedOn.last(), new Date())
          : true;
      });

    return (
      <>
        <ButtonGroup style={{ float: 'right' }}>
          <Button
            active={this.state.expand}
            id="dailyExpandAll"
            onClick={() =>
              this.state.expand
                ? this.setState({ expand: false })
                : this.setState({ expand: true })
            }
          >
            <Icon name={this.state.expand ? 'minus' : 'plus'} />
          </Button>
          <UncontrolledTooltip placement="bottom" target="dailyExpandAll" />
          <Button
            id="dailyShowAll"
            active={this.state.showCompleted}
            onClick={() =>
              this.state.showCompleted
                ? this.setState({ showCompleted: false })
                : this.setState({ showCompleted: true })
            }
          >
            <Icon name={'check'} />
          </Button>
          <UncontrolledTooltip placement="bottom" target="dailyShowAll">
            Show completed dailies
          </UncontrolledTooltip>
        </ButtonGroup>
        <CardDeck>
          {activeDailies.map((t: DailyType) => (
            <Daily
              key={t.id}
              daily={t}
              expand={this.state.expand}
              onComplete={() => onComplete(t.id)}
            >
              {t.streakCount > 4 && (
                <>
                  {t.streakCount}
                  <Icon name="fire" />
                </>
              )}
              {t.completedOn &&
                isBefore(t.completedOn.last(), subDays(new Date(), 7)) && (
                  <Icon name="warning-sign" />
                )}
              {t.title}
            </Daily>
          ))}
        </CardDeck>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dailies: state.get('dailies')
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onComplete: (id: string) => {
      dispatch(completeDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dailies);
