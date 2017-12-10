import * as React from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import completeDaily from '../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { List } from 'immutable';
import { isBefore, subDays, isSameDay } from 'date-fns';

interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<Daily>;
}

class Dailies extends React.Component<Props> {
  render() {
    const { onComplete, dailies } = this.props;
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <ButtonGroup>
          {dailies
            .filter((t: Daily) => {
              return t.completedOn && !t.completedOn.isEmpty()
                ? !isSameDay(t.completedOn.last(), new Date())
                : true;
            })
            .map((t: Daily) => {
              return (
                <Button
                  bsStyle="daily"
                  key={t.id}
                  onClick={() => onComplete(t.id)}
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
                </Button>
              );
            })}
        </ButtonGroup>
      </div>
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
