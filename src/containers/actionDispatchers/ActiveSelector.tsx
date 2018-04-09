import { connect } from 'react-redux';
import * as React from 'react';
import { setVisibilityFilter } from '../../actions/ui/visibilityFilter';
import { pullCompletedArticles } from '../../actions/syncWithFirebase';
import {
  Button,
  ButtonGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';
import { Article } from '../../constants/StoreState';

interface Props {
  onClick: (t: string) => void;
  fetchCompleted: () => void;
  currentActive: string;
  emptyCompleted: boolean;
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
    const { onClick, currentActive, emptyCompleted } = this.props;
    const options = ['Active', 'Completed', 'Today', 'All'];
    const nextActive =
      options[
        options.indexOf(currentActive) === options.length - 1
          ? 0
          : options.indexOf(currentActive) + 1
      ];
    if (
      (currentActive === 'Completed' || currentActive === 'All') &&
      emptyCompleted
    ) {
      this.props.fetchCompleted();
    }
    return (
      <ButtonGroup>
        <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
          <Button onClick={() => onClick(nextActive)}>{currentActive}</Button>
          <DropdownToggle caret={true} />
          <DropdownMenu>
            {options.map((t: string) => (
              <DropdownItem
                key={'activeSelector' + t}
                onClick={() => onClick(t)}
              >
                {t}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    currentActive: state.get('articleLists').visibilityFilter,
    emptyCompleted:
      state.get('articles').filter((t: Article) => t.completed).size === 0
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
