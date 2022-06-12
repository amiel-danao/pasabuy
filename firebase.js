import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCVCz_LymxPJGaVX_Uww9RalLQo55C_tSg",
  authDomain: "pasabuy-8d8bf.firebaseapp.com",
  projectId: "pasabuy-8d8bf",
  storageBucket: "pasabuy-8d8bf.appspot.com",
  messagingSenderId: "631663355432",
  appId: "1:631663355432:web:434c86758f2fc9f40ab71d",
  measurementId: "G-XDERCMHFJN",
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebase;
