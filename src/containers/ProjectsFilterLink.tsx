import { connect } from 'react-redux';
import { setProjectFilter } from '../actions/projectFilter';
import Link from '../components/Link';

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        active: ownProps.filter === state.projectFilter
    };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {

    return {
        onClick: () => {
            dispatch(setProjectFilter(ownProps.filter, ownProps.id));
        }
    };
};

const ProjectsFilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

export default ProjectsFilterLink;