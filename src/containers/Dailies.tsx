import * as React from 'react';
import {
  Well,
  Button,
  Glyphicon,
  ButtonToolbar,
  ButtonGroup
} from 'react-bootstrap';
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
  showCompleted: boolean;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { expand: false, showCompleted: false };
  }
  render() {
    const { onComplete, dailies } = this.props;
    return (
      <Well>
        <ButtonToolbar>
          <ButtonGroup bsStyle="dailies">
            {dailies
              .filter((t: DailyType) => {
                return t.completedOn && !t.completedOn.isEmpty()
                  ? this.state.showCompleted ||
                      !isSameDay(t.completedOn.last(), new Date())
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
                      isBefore(
                        t.completedOn.last(),
                        subDays(new Date(), 7)
                      ) && (
                        <b>
                          <Glyphicon glyph="warning-sign" />{' '}
                        </b>
                      )}
                    {t.title}
                  </Daily>
                );
              })}
          </ButtonGroup>
          <div style={{ float: 'right' }}>
            <ButtonGroup>
              <Button
                bsSize="xsmall"
                bsStyle="daily"
                onClick={() =>
                  this.state.expand
                    ? this.setState({ expand: false })
                    : this.setState({ expand: true })
                }
              >
                <Glyphicon
                  glyph={this.state.expand ? 'minus-sign' : 'plus-sign'}
                />
              </Button>
              <Button
                bsSize="xsmall"
                bsStyle="daily"
                active={true}
                onClick={() =>
                  this.state.showCompleted
                    ? this.setState({ showCompleted: false })
                    : this.setState({ showCompleted: true })
                }
              >
                <Glyphicon glyph={'check'} />
              </Button>
            </ButtonGroup>
          </div>
        </ButtonToolbar>
      </Well>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dailies: state.get('dailies'),
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
