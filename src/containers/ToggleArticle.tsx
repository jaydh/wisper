import * as React from 'react';
import { connect } from 'react-redux';
import { toggleArticleRead } from '../actions/toggleArticleRead';
import { Button } from 'react-bootstrap';

export interface Props {
  onToggleClick: any;
  id: string;
}

class ToggleArticleRead extends React.Component<Props> {
  render() {
    const { onToggleClick } = this.props;
    return (
      <div>
        <Button
          bsStyle="more"
          onClick={() => {
            onToggleClick();
          }}
        >
          {'\''}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onToggleClick: () => {
      dispatch(toggleArticleRead(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(ToggleArticleRead);
