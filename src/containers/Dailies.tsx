import * as React from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import completeDaily from '../actions/dailies/completeDaily';
import Daily from '../components/Daily';
import { Daily as DailyType } from '../constants/StoreState';
import { List } from 'immutable';
import { isBefore, subDays, isSameDay } from 'date-fns';

interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<DailyType>;
}

interface State {
  expand: boolean;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { expand: false };
  }
  render() {
    const { onComplete, dailies } = this.props;
    return (
      <ButtonToolbar>
        {dailies
          .filter((t: DailyType) => {
            return t.completedOn && !t.completedOn.isEmpty()
              ? !isSameDay(t.completedOn.last(), new Date())
              : true;
          })
          .map((t: DailyType) => {
            return (
              <Daily
                key={t.id}
                daily={t}
                expand={this.state.expand}
                onComplete={() => onComplete(t.id)}
              >
                {t.streakCount > 4 && (
                  <b>
                    {t.streakCount}
                    <Glyphicon glyph="fire" />{' '}
                  </b>
                )}
                {t.completedOn &&
                  isBefore(t.completedOn.last(), subDays(new Date(), 7)) && (
                    <b>
                      <Glyphicon glyph="warning-sign" />{' '}
                    </b>
                  )}
                {t.title}
              </Daily>
            );
          })}
        <Button
          bsSize="xsmall"
          onClick={() =>
            this.state.expand
              ? this.setState({ expand: false })
              : this.setState({ expand: true })
          }
        >
          <Glyphicon glyph={this.state.expand ? 'minus' : 'plus'} />
        </Button>
      </ButtonToolbar>
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
