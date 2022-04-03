import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { firebase } from '../firebase';

const auth = getAuth(firebase)
const db = getDatabase(firebase)

module.exports={
    auth: auth,
    db: db,
    signUpUser: (email, password, username)=>{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          alert("Sign up successful")
          const user = userCredential.user;
          updateProfile(user, {
              displayName: username
          })
          set(ref(db, 'users/'+user.uid), {
              lastOn: new Date().toISOString(),
              name: username,
              lifeSteps: 0,
              lifeCals: 0
            }
          )
        })
        .catch((error) => {
          alert(error.message)
        });
      },
      loginUser: (email, password)=>{
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          alert("Login successful")
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      },
      signOutUser: ()=>{
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      },
      writeData: (path, obj)=>{
        set(ref(db, path), obj);
      },
      readData:(path)=> {
          get(child(ref(db), path)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null
            }
        }).catch((error) => {
            console.error(error);
        })
    }
}