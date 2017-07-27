import * as React from 'react';
import { connect } from 'react-redux';
import { addArticleToProject } from '../actions/addArticleToProject';

export interface Props {
    dispatch: any;
    articleHash: string;
}

class AddArticleToProject extends React.Component<Props, {}> {
    render() {
        let input: any;
        const { dispatch, articleHash } = this.props;

        return (
            <div className="form-group">
                <form
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
                </form>
            </div >
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        articleHash: ownProps.articleHash
    };
};

export default connect(mapStateToProps)(AddArticleToProject);