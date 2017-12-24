import * as React from 'react';
import { connect } from 'react-redux';
import finalizeDaily from '../../actions/dailies/finalizeDaily';
import { Button, Glyphicon } from 'react-bootstrap';

export interface Props {
  onClick: () => void;
  id: string;
}

class FinalizeDaily extends React.Component<Props, {}> {
  render() {
    const { onClick } = this.props;
    return (
      <Button bsSize="xsmall" onClick={() => onClick()}>
        Finalize <Glyphicon glyph="inbox" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: () => {
      dispatch(finalizeDaily(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(FinalizeDaily);
