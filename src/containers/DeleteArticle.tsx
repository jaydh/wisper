import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticle } from '../actions/deleteArticle';

export interface Props {
    dispatch: any;
    articleHash: string;
}

class DeleteArticle extends React.Component<Props, {}> {
    render() {
        const { dispatch, articleHash } = this.props
        return (
            <div>
                    <button type="button" className="btn btn-danger" onClick={() => dispatch(deleteArticle(articleHash))}>
                        delete
                    </button>
            </div >
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        articleHash: ownProps.articleHash
    };
};

export default connect(mapStateToProps)(DeleteArticle);