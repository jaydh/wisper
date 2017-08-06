import * as React from 'react';
import { connect } from 'react-redux';
import { addArticleToProject } from '../actions/addArticleToProject';
import { Form } from 'react-bootstrap';

export interface Props {
  dispatch: any;
  articleHash: string;
}

class AddArticleToProject extends React.Component<Props, {}> {
  render() {
    let input: any;
    const { dispatch, articleHash } = this.props;

    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(addArticleToProject(articleHash, input.value));
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
    articleHash: ownProps.articleHash
  };
};

export default connect(mapStateToProps)(AddArticleToProject);
