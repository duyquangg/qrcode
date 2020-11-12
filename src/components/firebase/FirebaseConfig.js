import firebase from 'firebase';
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAN_n_g68Wv8Yh4k2KsJBhsO3W682Ycvuk",
    authDomain: "qrcode-a7409.firebaseapp.com",
    databaseURL: "https://qrcode-a7409.firebaseio.com",
    projectId: "qrcode-a7409",
    storageBucket: "qrcode-a7409.appspot.com",
    messagingSenderId: "602425954881",
    appId: "1:602425954881:web:f0eebd09d9a1928bcd2cc0",
    measurementId: "G-43HBNVYRQ1"
};
firebase.initializeApp(firebaseConfig);
export { firebase }

