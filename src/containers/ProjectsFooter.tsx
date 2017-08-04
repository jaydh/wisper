import * as React from 'react';
import ProjectsFilterLink from '../containers/ProjectsFilterLink';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { StoreState } from '../constants/StoreState';

interface Props {
  projects: List<String>;
}

class ProjectsFooter extends React.Component<Props> {
  render() {
    const { projects } = this.props;
    console.log(projects);
    return (
      <div>
        <ProjectsFilterLink filter="NONE">
          NoFilter {', '}
        </ProjectsFilterLink>
        {projects
          ? projects.map(project => {
              console.log(project);
              return (
                <ProjectsFilterLink key={project} filter={project}>
                  {project}
                </ProjectsFilterLink>
              );
            })
          : <p>No project Filters</p>}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState, ownProps: any) => {
  return {
    projects: state.projects
  };
};

export default connect(mapStateToProps)(ProjectsFooter);
