import firebase from "firebase";
import 'firebase/firestore'
import "firebase/storage";
var firebaseConfig = {
    apiKey: "AIzaSyDwsFxXAifEeCmc_kbghCVmuKSZ68A8gGo",
    authDomain: "salesmen-fa32c.firebaseapp.com",
    databaseURL: "https://salesmen-fa32c.firebaseio.com",
    projectId: "salesmen-fa32c",
    storageBucket: "salesmen-fa32c.appspot.com",
    messagingSenderId: "964604240316",
    appId: "1:964604240316:web:0ed7d43b10d790af520bb9",
    measurementId: "G-X1422N17J7"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();


export { firebase, storage as default };