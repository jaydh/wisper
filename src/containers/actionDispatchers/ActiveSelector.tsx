import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/ui/visibilityFilter';
import { pullCompletedArticles } from '../../actions/syncWithFirebase';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';

interface Props {
  onClick: (t: string) => void;
  fetchCompleted: () => void;
  currentActive: string;
}
interface State {
  isOpen: Boolean;
}

class ActiveSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    const { onClick, currentActive } = this.props;
    const options = ['Active', 'Completed', 'Today', 'All'];
    return (
      <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle caret={true}>{currentActive}</DropdownToggle>
        <DropdownMenu>
          {options.map((t: string) => (
            <DropdownItem
              key={'activeSelector' + t}
              onClick={() => {
                onClick(t);
                if (t === 'Completed' || t === 'All') {
                  this.props.fetchCompleted();
                }
              }}
            >
              {t}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    currentActive: state.get('articleLists').visibilityFilter
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onClick: (filter: string) => {
      dispatch(setVisibilityFilter(filter));
    },
    fetchCompleted: () => dispatch(pullCompletedArticles())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveSelector);
