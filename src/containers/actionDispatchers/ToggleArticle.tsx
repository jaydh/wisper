import * as React from 'react';
import { connect } from 'react-redux';
import { toggleArticleRead } from '../../actions/articles/toggleArticleRead';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  onToggleClick: () => void;
  id: string;
}

class ToggleArticleRead extends React.Component<Props> {
  render() {
    const { onToggleClick } = this.props;
    return (
      <Button
        onClick={() => {
          onToggleClick();
        }}
      >
        <Icon name="check" />
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
