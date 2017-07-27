import * as React from 'react';
import { connect } from 'react-redux';
import { addArticle } from '../actions/addArticle';

let AddArticle = ({ dispatch }: any) => {
  let input: any;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }

          dispatch(addArticle(input.value));
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit" className="btn">
          Add Article
        </button>
      </form>
    </div >
  );
};

export default connect()(AddArticle);