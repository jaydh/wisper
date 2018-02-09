import * as React from 'react';
import { Article } from '../../constants/StoreState';
import setUIView from '../../actions/ui/setUIView';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ButtonGroup, Button } from 'reactstrap';

interface Props {
  articleID: string;
  article: Article;
  onClickContinue: () => void;
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
          <ButtonGroup>
            <Button
              onClick={() => {
                this.props.onClickContinue();
                this.setAsked();
              }}
            >
              Yes
            </Button>
            <Button onClick={() => this.setAsked()}> No</Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    article: state
      .get('articles')
      .find((t: Article) => t.id === ownProps.articleID)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onClickContinue: () => dispatch(setUIView('article'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SuggestContineuArticle
);
