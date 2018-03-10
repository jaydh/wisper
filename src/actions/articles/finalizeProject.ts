import { auth, database } from '../../firebase';
import { Dispatch } from 'react-redux';
import { fromJS } from 'immutable';

export interface DeleteProjectRequested {
  type: 'DELETE_PROJECT_REQUESTED';
}
export interface DeleteProjectFulfilled {
  type: 'DELETE_PROJECT_FULFILLED';
  project: string;
}
export interface DeleteProjectRejected {
  type: 'DELETE_PROJECT_REJECTED';
}

function DeleteProjectRequested(): DeleteProjectRequested {
  return {
    type: 'DELETE_PROJECT_REQUESTED'
  };
}

function DeleteProjectFulfilled(project: string): DeleteProjectFulfilled {
  return {
    type: 'DELETE_PROJECT_FULFILLED',
    project
  };
}

function DeleteProjectRejected(): DeleteProjectRejected {
  return {
    type: 'DELETE_PROJECT_REJECTED'
  };
}
export default function deleteProject(project: string) {
  const user = auth()!.currentUser!.uid;
  return (dispatch: Dispatch<any>) => {
    dispatch(DeleteProjectRequested());
    const projectsRef = database.ref('/userData/' + user + '/projects/');

    return projectsRef.once('value').then((snapshot: any) => {
      const update = fromJS(snapshot.val())
        .map((t: any) => {
          return t.get('id') !== project
            ? t
            : t.set('finalized', !t.get('finalized'));
        })
        .toJS();
      console.log(update);
      projectsRef.set(update);
    });
  };
}
