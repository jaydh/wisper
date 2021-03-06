import * as React from 'react';
import { connect } from 'react-redux';
import finalizeProject from '../../actions/articles/finalizeProject';
import { ButtonGroup, Button } from 'reactstrap';
import { Icon } from 'react-fa';
import { List } from 'immutable';
import { Project } from '../../constants/StoreState';

interface Props {
  onFinalizeClick: (project: string) => void;
  projects: List<Project>;
}

class DeleteProject extends React.Component<Props> {
  render() {
    const { onFinalizeClick, projects } = this.props;
    return (
      <ButtonGroup vertical={true}>
        {projects.map((t: Project) => (
          <Button
            key={`Remove project:${t.id}`}
            onClick={() => {
              onFinalizeClick(t.id);
            }}
          >
            {t.id} <Icon name={t.finalized ? 'pencil' : 'check'} />
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.get('projects')
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onFinalizeClick: (project: string) => {
      dispatch(finalizeProject(project));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteProject);
