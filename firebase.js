import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDemTt7LzEalHICxh1-YuBmT9gMNMyGRME",
    authDomain: "chatapp-ed047.firebaseapp.com",
    projectId: "chatapp-ed047",
    storageBucket: "chatapp-ed047.appspot.com",
    messagingSenderId: "28458494874",
    appId: "1:28458494874:web:3cbe0d7cddbc0eb1676823"
  };

  let app;

  if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
  }else{
    app = firebase.app();
  }

  const db = app.firestore();
  const auth = firebase.auth();

  export { db, auth };