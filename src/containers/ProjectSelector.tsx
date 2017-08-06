import * as React from 'react';
import ProjectsFilterLink from '../containers/ProjectsFilterLink';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { StoreState } from '../constants/StoreState';

interface Props {
  projects: List<String>;
  id: Number;
}

class ProjectsFooter extends React.Component<Props> {
  render() {
    const { projects, id } = this.props;
    return (
      <div>
        <span>
          Show project: {' '}
          <ProjectsFilterLink filter="ALL" id={id}>
            All
          </ProjectsFilterLink>
          {projects
            ? projects.map(project => {
                return (
                  <span key={String(project)}>
                    {', '}
                    <ProjectsFilterLink filter={project} id={id}>
                      {project}
                    </ProjectsFilterLink>
                  </span>
                );
              })
            : <p>No Projects</p>}
          {' , '}
          <ProjectsFilterLink filter="NONE" id={id}>
            None
          </ProjectsFilterLink>
        </span>
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
