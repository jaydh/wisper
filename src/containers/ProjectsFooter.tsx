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
    return (
      <div>
        <span>
          Show project: {' '}
          <ProjectsFilterLink filter="NONE">None</ProjectsFilterLink>
          {projects
            ? projects.map(project => {
                return (
                  <span key={String(project)}>
                    {', '}
                    <ProjectsFilterLink filter={project}>
                      {project}
                    </ProjectsFilterLink>
                  </span>
                );
              })
            : <p>No project Filters</p>}
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
