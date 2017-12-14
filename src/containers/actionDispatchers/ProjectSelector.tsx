import * as React from 'react';
import { setProjectFilter } from '../../actions/projectFilter';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';
import { Dropdown, MenuItem } from 'react-bootstrap';
import {
  ArticleList as ArticleListType,
  Article as articleType
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
    const options = ['All', ...projects.toJS(), 'None'];
    return (
      <Dropdown id="bg-nested-dropdown">
        <Dropdown.Toggle className="filter">
          {currentProject}
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-dropdown ">
          {options.map(project => {
            return (
              <MenuItem
                eventKey={String(project)}
                key={String(project)}
                onClick={() => onClick(String(project))}
              >
                {project}{' '}
                <div style={{ float: 'right' }}>
                  {articlesInActivity
                    .filter((t: articleType) => {
                      switch (project) {
                        case 'All':
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
      .get('projects')
      .keySeq()
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
