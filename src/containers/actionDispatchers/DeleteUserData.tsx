import * as React from 'react';
import { connect } from 'react-redux';
import { deleteUserData } from '../../actions/deleteUserData';
import { Button, ButtonGroup } from 'reactstrap';
import { Icon } from 'react-fa';

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
        <Button onClick={() => this.toggleLock()}>
          Toggle the dangerous button to the right
          <Icon name="chevron-right" />
        </Button>

        <Button
          disabled={this.state.locked}
          onClick={() => this.props.onDeleteClick()}
        >
          Delete user data <Icon name="trash" />
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
