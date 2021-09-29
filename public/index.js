import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
const faker = require('faker');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDV0_3FwBZs3ZcVbgSru0ufPNRQ5js8Fqo',
  authDomain: 'firebasics-9f6db.firebaseapp.com',
  projectId: 'firebasics-9f6db',
  storageBucket: 'firebasics-9f6db.appspot.com',
  messagingSenderId: '314092083620',
  appId: '1:314092083620:web:d4e1f669b9162cabec4931',
  measurementId: 'G-QL4TY2J51T'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new GoogleAuthProvider();

signInBtn.onclick = async () => {
  return await signInWithPopup(auth, provider);
};

signOutBtn.onclick = async () => {
  return await auth.signOut();
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('logged in!');

    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `
    <h2>Hello ${user.displayName}!</h2>
    <p>ID: ${user.uid}</p>
    `;
  } else {
    console.log('not signed in');

    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = ``;
  }
});

// Firestore

const db = getFirestore(app);

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = collection(db, 'things');

    createThing.onclick = () => {
      addDoc(thingsRef, {
        uid: user.uid,
        name: faker.commerce.product(),
        createdAt: serverTimestamp()
      });
    };

    unsubscribe = onSnapshot(
      query(
        thingsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      ),
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });
        thingsList.innerHTML = items.join('');
      }
    );
  } else {
    unsubscribe && unsubscribe();
  }
});
