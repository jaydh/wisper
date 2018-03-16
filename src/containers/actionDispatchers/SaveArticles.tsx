import * as React from 'react';
import { connect } from 'react-redux';
import saveArticles from '../../actions/articles/saveArticles';
import { Button } from 'reactstrap';
import { Icon } from 'react-fa';

export interface Props {
  onSaveClick: () => void;
}

class SaveArticle extends React.Component<Props, {}> {
  render() {
    const { onSaveClick } = this.props;
    return (
      <Button onClick={() => onSaveClick()}>
        <Icon name="save" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onSaveClick: () => {
      dispatch(saveArticles());
    }
  };
};

export default connect(null, mapDispatchToProps)(SaveArticle);
