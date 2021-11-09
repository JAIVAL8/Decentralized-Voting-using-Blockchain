import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC5X4vFscjfwk9KouYX9-a5Bli3_RGKG7Q",
  authDomain: "f-votechain.firebaseapp.com",
  projectId: "f-votechain",
  storageBucket: "f-votechain.appspot.com",
  messagingSenderId: "59270321849",
  appId: "1:59270321849:web:87ce55e913cdd61a6e2d68",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
