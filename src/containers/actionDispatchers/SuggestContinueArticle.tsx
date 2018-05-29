import * as React from 'react';
import { Article } from '../../constants/StoreState';
import setUIView from '../../actions/ui/setUIView';
import setCurrentArticle from '../../actions/ui/setCurrentArticle';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';

interface Props {
  article: Article;
  onClickContinue: () => void;
  onClickNo: () => void;
}

interface State {
  asked: boolean;
}

class SuggestContineuArticle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { asked: false };
    this.setAsked = this.setAsked.bind(this);
  }
  setAsked() {
    this.setState({ asked: true });
  }
  render() {
    return (
      <Modal isOpen={!this.state.asked}>
        <ModalBody>Continue reading '{this.props.article.title}'?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              this.props.onClickContinue();
              this.setAsked();
            }}
          >
            Yes
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              this.setAsked();
              this.props.onClickNo();
            }}
          >
            {' '}
            No
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onClickContinue: () => dispatch(setUIView('article')),
    onClickNo: () => dispatch(setCurrentArticle(null))
  };
};

export default connect(null, mapDispatchToProps)(SuggestContineuArticle);
