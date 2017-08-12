import Canvas from '../components/Canvas';
import { connect } from 'react-redux';
import { ListenToFirebase } from '../actions/syncArticles';
import addArticleList from '../actions/addArticleList';

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddArticleList: () => {
      dispatch(addArticleList());
    },
    ListenToFirebase: () => {
        dispatch(ListenToFirebase());
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleLists: state.get('articleLists')
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
