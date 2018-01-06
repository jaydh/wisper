import * as React from 'react';
import { setProjectFilter } from '../../actions/ui/projectFilter';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import { Dropdown, MenuItem } from 'react-bootstrap';
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

class ProjectSelector extends React.Component<Props> {
  render() {
    const {
      projects,
      currentProject,
      onClick,
      articlesInActivity
    } = this.props;
    const options = ['All Projects', ...projects.toJS(), 'None'];
    return (
      <Dropdown id="bg-nested-dropdown">
        <Dropdown.Toggle>{currentProject}</Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map(project => {
            return (
              <MenuItem
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
              </MenuItem>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state
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
