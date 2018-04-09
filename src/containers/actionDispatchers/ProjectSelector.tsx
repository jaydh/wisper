import * as React from 'react';
import { setProjectFilter } from '../../actions/ui/projectFilter';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { Article as articleType, Project } from '../../constants/StoreState';

interface Props {
  projects: List<String>;
  currentProject: string;
  articlesInActivity: List<articleType>;
  onClick: (t: string) => void;
}
interface State {
  isOpen: boolean;
}

class ProjectSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    const {
      projects,
      currentProject,
      onClick,
      articlesInActivity
    } = this.props;
    const options = ['All Projects', ...projects.toJS(), 'None'];
    return (
      <Navbar expand="sm">
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
          <Nav navbar={true} tabs={true} vertical={true}>
            {options.map((project: string) => {
              return (
                <NavItem key={'projectSelectorItem ' + String(project)}>
                  <NavLink
                    onClick={() => onClick(project)}
                    active={project === currentProject}
                  >
                    {project}{' '}
                    <div style={{ display: 'inline-block', float: 'right' }}>
                      {articlesInActivity
                        .filter((t: articleType) => {
                          switch (project) {
                            case 'All Projects':
                              return true;
                            case 'None':
                              return !t.projects;
                            default:
                              return t.projects
                                ? fromJS(t.projects).includes(project)
                                : false;
                          }
                        })
                        .count()}
                    </div>
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state
      .get('projects')
      .map((t: Project) => t.id)
      .sort((a: string, b: string) => a.localeCompare(b)),
    currentProject: state.get('articleLists').projectFilter
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (filter: string) => {
      dispatch(setProjectFilter(filter));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelector);
