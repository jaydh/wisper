import * as React from 'react';
import { connect } from 'react-redux';
import { toggleArticleRead } from '../actions/toggleArticleRead';

export interface Props {
  onToggleClick: any;
  id: string;
}

class ToggleArticleRead extends React.Component<Props> {
  render() {
    const { onToggleClick } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            onToggleClick();
          }}
        >
          Toggle
        </button>
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
