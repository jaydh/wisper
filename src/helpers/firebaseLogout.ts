import { auth } from '../firebase';

export default function() {
  auth().signOut();
}
