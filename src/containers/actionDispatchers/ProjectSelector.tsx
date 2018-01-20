import * as React from 'react';
import { setProjectFilter } from '../../actions/ui/projectFilter';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import {
  ArticleList as ArticleListType,
  Article as articleType,
  Project
} from '../../constants/StoreState';

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
      <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle caret={true}>{currentProject}</DropdownToggle>
        <DropdownMenu>
          {options.map((project: string) => {
            return (
              <DropdownItem
                id={String(project)}
                key={'projectSelectorItem ' + String(project)}
                onClick={() => onClick(String(project))}
              >
                {project}
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
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state
      .get('projects')
      .map((t: Project) => t.id)
      .sort((a: string, b: string) => a.localeCompare(b)),
    currentProject: state
      .get('articleLists')
      .find((list: ArticleListType) => list.id === ownProps.id).projectFilter
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (filter: string) => {
      dispatch(setProjectFilter(filter, ownProps.id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelector);
