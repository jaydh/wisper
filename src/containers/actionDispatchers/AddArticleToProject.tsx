import * as React from 'react';
import { connect } from 'react-redux';
import addArticleToProject from '../../actions/articles/addArticleToProject';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { List } from 'immutable';

export interface Props {
  id: string;
  projects: List<string>;
  onAddToProject: (t: string, p: string) => void;
}

class AddArticleToProject extends React.Component<Props, {}> {
  render() {
    const { onAddToProject, projects, id } = this.props;
    return (
      <DropdownButton
        bsSize="sm"
        title="Add to Project"
        id={id + 'addProjectDropdown'}
      >
        {projects.map((t: string) => (
          <MenuItem
            key={id + ' addProject ' + t}
            onClick={() => onAddToProject(id, t)}
          >
            {t}
          </MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state
      .get('projects')
      .keySeq()
      .toList()
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddToProject: (article: string, project: string) => {
      dispatch(addArticleToProject(article, project));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  AddArticleToProject
);
