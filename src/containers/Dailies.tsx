import * as React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  Jumbotron,
  Button,
  Collapse
} from 'react-bootstrap';
import { connect } from 'react-redux';
import addDaily from '../actions/dailies/addDaily';
import completeDaily from '../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { List } from 'immutable';
import DailyGraph from './graphs/DailyGraph';

interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<Daily>;
}

interface State {
  dailyValue: string;
  graphOpen: boolean;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { dailyValue: '', graphOpen: false };
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
          <Button
            onClick={() => {
              this.setState({ graphOpen: !this.state.graphOpen });
            }}
          >
            Show graph
          </Button>
        </Form>
        <Jumbotron className="canvas">
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
          {this.state.graphOpen && (
            <Collapse in={this.state.graphOpen}>
              <DailyGraph />
            </Collapse>
          )}
        </Jumbotron>
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
    AddDaily: (daily: string) => {
      dispatch(addDaily(daily));
    },
    onComplete: (id: string) => {
      dispatch(completeDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dailies);
