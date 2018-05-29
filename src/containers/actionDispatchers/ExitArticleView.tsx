import setUIView from '../../actions/ui/setUIView';
import setCurrentArticle from '../../actions/ui/setCurrentArticle';
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
      <Button
        onClick={() => {
          onExit();
        }}
      >
        <Icon name="arrow-left" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onExit: () => {
      dispatch(setUIView('compact'));
      dispatch(setCurrentArticle(null));
    }
  };
};

export default connect(null, mapDispatchToProps)(ExitArticleView);
