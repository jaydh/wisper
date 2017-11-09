import * as React from 'react';
import { connect } from 'react-redux';
import { togglelockArticleList } from '../../actions/articleList';
import { Glyphicon } from 'react-bootstrap';

export interface Props {
  onLockClick(): () => void;
}

class LockArticleList extends React.Component<Props, {}> {
  render() {
    const { onLockClick } = this.props;
    return (
      <button
        type="button"
        onClick={() => onLockClick()}
        className="close"
        aria-label="Close"
        style={{ position: 'absolute', top: '1em', left: '1em' }}
      >
        <Glyphicon glyph="lock" />
      </button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onLockClick: () => {
      dispatch(togglelockArticleList(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(LockArticleList);
