import { connect } from 'react-redux';
import { setProjectFilter } from '../actions/projectFilter';
import Link from '../components/Link';

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    active: ownProps.filter === state.projectFilter
  };
};
interface OwnProps {
  filter: string;
  id: string;
}

const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => {
  return {
    onClick: () => {
      dispatch(setProjectFilter(ownProps.filter, ownProps.id));
    }
  };
};

const ProjectsFilterLink = connect(mapStateToProps, mapDispatchToProps)(Link);

export default ProjectsFilterLink;
