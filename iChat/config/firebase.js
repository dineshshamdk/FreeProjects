import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';   
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjUMbISYv0K7JuWN5UdRPyc1aXkUPgTzA",
  authDomain: "ichat-e1fd0.firebaseapp.com",
  projectId: "ichat-e1fd0",
  storageBucket: "ichat-e1fd0.appspot.com",
  messagingSenderId: "676825064796",
  appId: "1:676825064796:web:fdb6d99c4bc6dd2f988d99",
  databaseURL: "https://chatapp-73200-default-rtdb.firebaseio.com",
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();


export const iauth =  getAuth();
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
export const database = getFirestore();