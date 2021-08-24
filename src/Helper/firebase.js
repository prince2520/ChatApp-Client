import firebase from "firebase/app";
import "firebase/storage"
const firebaseConfig = {
        apiKey: "AIzaSyCqPRy1ntoWll_IKb-o9lSHdP4ljMVn_vw",
        authDomain: "chatapp-c27d2.firebaseapp.com",
        projectId: "chatapp-c27d2",
        storageBucket: "chatapp-c27d2.appspot.com",
        messagingSenderId: "833086027455",
        appId: "1:833086027455:web:7e0d357e516a448c40f80a"
    };

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {storage, firebase as default}
