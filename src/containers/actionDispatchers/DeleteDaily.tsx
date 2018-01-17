import * as React from 'react';
import { connect } from 'react-redux';
import finalizeDaily from '../../actions/dailies/finalizeDaily';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';

interface Props {
  onToggleClick: (id: string) => void;
  dailies: List<Daily>;
}

class DeleteArticle extends React.Component<Props> {
  render() {
    const { onToggleClick, dailies } = this.props;
    return (
      <ButtonGroup vertical={true}>
        {dailies.map((t: Daily) => (
          <Button
            key={'deleteDaily' + t.id}
            onClick={() => {
              onToggleClick(t.id);
            }}
          >
            {t.finalized ? 'Continue tracking' : 'Halt tracking'} "{t.title}"
            Daily <Glyphicon glyph={t.finalized ? 'road' : 'flag'} />
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dailies: state.get('dailies')
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onToggleClick: (id: string) => {
      dispatch(finalizeDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteArticle);
