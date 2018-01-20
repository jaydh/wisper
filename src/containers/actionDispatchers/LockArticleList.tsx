import * as React from 'react';
import { connect } from 'react-redux';
import { togglelockArticleList } from '../../actions/ui/articleList';
import { Button } from 'reactstrap';

export interface Props {
  onLockClick(): () => void;
}

class LockArticleList extends React.Component<Props, {}> {
  render() {
    const { onLockClick } = this.props;
    return (
      <Button
        type="button"
        onClick={() => onLockClick()}
        className="close"
        aria-label="Close"
      />
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
