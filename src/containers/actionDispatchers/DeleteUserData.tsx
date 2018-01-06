import * as React from 'react';
import { connect } from 'react-redux';
import { deleteUserData } from '../../actions/deleteUserData';
import { Button, Glyphicon, ButtonGroup } from 'react-bootstrap';

interface Props {
  onDeleteClick: () => void;
}
interface State {
  locked: boolean;
}

class DeleteArticleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { locked: true };
  }

  toggleLock() {
    this.setState({ locked: !this.state.locked });
  }

  render() {
    return (
      <ButtonGroup>
        <Button bsSize="small" onClick={() => this.toggleLock()}>
          Toggle the dangerous button to the right
          <Glyphicon glyph="chevron-right" />
        </Button>

        <Button
          bsSize="small"
          disabled={this.state.locked}
          onClick={() => this.props.onDeleteClick()}
        >
          Delete user data <Glyphicon glyph="floppy-remove" />
        </Button>
      </ButtonGroup>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: () => {
      dispatch(deleteUserData());
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticleList);
