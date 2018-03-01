import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/ui/visibilityFilter';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';

interface Props {
  onClick: (t: string) => void;
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
            <DropdownItem key={'activeSelector' + t} onClick={() => onClick(t)}>
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveSelector);
