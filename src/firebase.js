import * as firebase from 'firebase';

const config = {
   apiKey: "AIzaSyDo_wwkTNR_SlGnZa6cDz3eNdVqKQ6_vpY",
   authDomain: "goalcoach-1a926.firebaseapp.com",
   databaseURL: "https://goalcoach-1a926.firebaseio.com",
   projectId: "goalcoach-1a926",
   storageBucket: "goalcoach-1a926.appspot.com",
   messagingSenderId: "913632517812"
 };
 export const firebaseApp = firebase.initializeApp(config);
