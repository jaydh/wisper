import * as React from 'react';
import {
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';
import { addProject } from '../actions/syncWithFirebase';
import addArticleToProject from '../actions/articles/addArticleToProject';

interface Props {
  show: boolean;
  toggle: (val: boolean) => void;
  articleBinding: string;
  onAddProject: (val: string) => void;
  onAddArticleToProject: (id: string, project: string) => void;
}

interface State {
  value: string;
}

class AddProjectModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: any) {
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={() => this.props.toggle(!this.props.show)}
      >
        <ModalHeader toggle={() => this.props.toggle(false)}>
          Add {this.props.articleBinding && <>article to</>} new project
        </ModalHeader>
        <ModalBody>
          <Form
            inline={true}
            onSubmit={event => {
              event.preventDefault();
              this.props.onAddProject(this.state.value);
              this.props.onAddArticleToProject(
                this.props.articleBinding,
                this.state.value
              );
              this.props.toggle(!this.props.show);
            }}
          >
            <FormGroup type="text">
              <Input
                placeholder={
                  this.state.value === '' ? 'Project Name...' : this.state.value
                }
                onChange={event => this.handleChange(event)}
              />
              <FormFeedback />
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    articleBinding: state.get('ui').projectModalArticleBinding
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddProject: (val: string) => dispatch(addProject(val)),
    onAddArticleToProject: (id: string, project: string) =>
      dispatch(addArticleToProject(id, project))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectModal);
