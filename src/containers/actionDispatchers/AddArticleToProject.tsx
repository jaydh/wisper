import * as React from 'react';
import { connect } from 'react-redux';
import { addArticleToProject } from '../../actions/addArticleToProject';
import { Form } from 'react-bootstrap';
import { Article as articleType } from '../../constants/StoreState';

export interface Props {
  article: articleType;
  onAddToProject: (t: articleType, p: string) => void;
}

class AddArticleToProject extends React.Component<Props, {}> {
  render() {
    let input: any;
    const { onAddToProject, article } = this.props;
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          onAddToProject(article, input.value);
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit" className="btn">
          Add Article to Project
        </button>
      </Form>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    article: state
      .get('articles')
      .find((t: articleType) => t.id === ownProps.id)
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddToProject: (article: articleType, project: string) => {
      dispatch(addArticleToProject(article, project));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  AddArticleToProject
);
