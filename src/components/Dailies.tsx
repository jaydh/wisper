import * as React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  Jumbotron,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import addDaily from '../actions/dailies/addDaily';
import completeDaily from '../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { List, OrderedSet } from 'immutable';
import DailyGraph from '../containers/DailyGraph';

interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<Daily>;
}

interface State {
  dailyValue: string;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { dailyValue: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: any) {
    e.preventDefault();
    this.setState({ dailyValue: e.target.value });
  }

  render() {
    const { onComplete, dailies, AddDaily } = this.props;
    return (
      <div>
        <Form
          inline={true}
          onSubmit={event => {
            event.preventDefault();
            AddDaily(this.state.dailyValue);
            this.setState({ dailyValue: '' });
          }}
        >
          <FormGroup controlId="formBasicText">
            <FormControl
              type="text"
              value={this.state.dailyValue}
              placeholder="Add daily"
              onChange={this.handleChange}
            />
          </FormGroup>
        </Form>
        {// Only show if there are dailies active
        dailies
          .map((t: Daily) => t.completedOn)
          .filter(
            (t: OrderedSet<Date>) =>
              t ? t.last().toDateString() !== new Date().toDateString() : true
          ).size !== 0 && (
          <Jumbotron>
            {dailies
              .filter((t: Daily) => {
                return t.completedOn && !t.completedOn.isEmpty()
                  ? t.completedOn.last().toDateString() !==
                    new Date().toDateString()
                  : true;
              })
              .map((t: Daily) => {
                return (
                  <Button key={t.id} onClick={() => onComplete(t.id)}>
                    {t.title}
                  </Button>
                );
              })}
            <DailyGraph />
          </Jumbotron>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    dailies: state.get('dailies')
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    AddDaily: (daily: string) => {
      dispatch(addDaily(daily));
    },
    onComplete: (id: string) => {
      dispatch(completeDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dailies);
