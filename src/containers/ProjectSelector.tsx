import * as React from 'react';
import { setProjectFilter } from '../actions/projectFilter';
import { connect } from 'react-redux';
import { List } from 'immutable';
import {  DropdownButton, MenuItem } from 'react-bootstrap';
import { ArticleList as ArticleListType } from '../constants/StoreState';

interface Props {
  projects: List<String>;
  currentProject: string;
  onClick: any;
  id: string;
}

class ProjectSelector extends React.Component<Props> {
  render() {
    const { projects, currentProject, onClick } = this.props;
    return (
        <DropdownButton
          bsStyle="default"
          title={currentProject}
          noCaret={true}
          id="dropdown-no-caret"
        >
          <MenuItem eventKey="1" onClick={() => onClick('ALL')}>
            All
          </MenuItem>
          <MenuItem divider={true} />
          {projects.map(project => {
            return (
              <MenuItem
                eventKey={String(project)}
                key={String(project)}
                onClick={() => onClick(String(project))}
              >
                {project}
              </MenuItem>
            );
          })}
          <MenuItem divider={true} />
          <MenuItem eventKey="4" onClick={() => onClick('NONE')}>
            None
          </MenuItem>
        </DropdownButton>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state.get('projects'),
    currentProject: state
      .get('articleLists')
      .find((list: ArticleListType) => list.id === ownProps.id).projectFilter
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: Props) => {
  return {
    onClick: (filter: string) => {
      dispatch(setProjectFilter(filter, ownProps.id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelector);
