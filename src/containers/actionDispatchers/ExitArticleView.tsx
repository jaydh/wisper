import setUIView from '../../actions/ui/setUIView';
import { connect } from 'react-redux';
import * as React from 'react';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  onExit: () => void;
}

class ExitArticleView extends React.Component<Props, {}> {
  render() {
    const { onExit } = this.props;
    return (
      <Button onClick={() => onExit()} size="small">
        <Icon name="arrow-left" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onExit: () => {
      dispatch(setUIView('compact'));
    }
  };
};

export default connect(null, mapDispatchToProps)(ExitArticleView);
