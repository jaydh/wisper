import * as React from 'react';
import { connect } from 'react-redux';
import deleteDaily from '../../actions/dailies/deleteDaily';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';

interface Props {
  onDeleteClick: (id: string) => void;
  dailies: List<Daily>;
}

interface State {
  locked: boolean;
}

class DeleteArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { locked: true };
  }
  toggleLock() {
    this.setState({ locked: !this.state.locked });
  }

  render() {
    const { onDeleteClick, dailies } = this.props;
    return (
      <ButtonGroup vertical={true}>
        <Button bsSize="small" onClick={() => this.toggleLock()}>
          Toggle deleting dailies
          <Glyphicon glyph="chevron-down" />
        </Button>
        {dailies.map((t: Daily) => (
          <Button
            disabled={this.state.locked}
            key={'deleteDaily' + t.id}
            onClick={() => {
              onDeleteClick(t.id);
            }}
          >
            Delete "{t.title}" <Glyphicon glyph="remove" />
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dailies: state.get('dailies')
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: (id: string) => {
      dispatch(deleteDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteArticle);
