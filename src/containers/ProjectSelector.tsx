import * as React from 'react';
import ProjectsFilterLink from '../containers/ProjectsFilterLink';
import { connect } from 'react-redux';
import { List } from 'immutable';
// import { StoreState } from '../constants/StoreState';

interface Props {
  projects: List<String>;
  id: string;
}

class ProjectsFooter extends React.Component<Props> {
  render() {
    const { projects, id } = this.props;
    return (
      <div>
        <p>
          Project: {' '}
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
            : <p>No project Filters</p>}
          {', '}
          <ProjectsFilterLink filter="NONE" id={id}>
            None
          </ProjectsFilterLink>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state.get('projects')
  };
};

export default connect(mapStateToProps)(ProjectsFooter);
