import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBq_FHS-DxcVK2XCv1zPrjIFAkWj7oAipk",
    authDomain: "hackru22.firebaseapp.com",
    databaseURL: "https://hackru22-default-rtdb.firebaseio.com",
    projectId: "hackru22",
    storageBucket: "hackru22.appspot.com",
    messagingSenderId: "715947870871",
    appId: "1:715947870871:web:b2e7ca3a84929877e977d2",
    measurementId: "G-E22SX146BR"
};

const firebase = initializeApp(firebaseConfig);

export {firebase }