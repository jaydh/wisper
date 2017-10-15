import * as React from 'react';
import { connect } from 'react-redux';
import { toggleArticleRead } from '../../actions/articles/toggleArticleRead';
import { Glyphicon, Button } from 'react-bootstrap';

export interface Props {
  onToggleClick: () => void;
  id: string;
}

class ToggleArticleRead extends React.Component<Props> {
  render() {
    const { onToggleClick } = this.props;
    return (
      <Button
        bsStyle="more"
        onClick={() => {
          onToggleClick();
        }}
      >
        <Glyphicon glyph="ok" />
      </Button>
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
