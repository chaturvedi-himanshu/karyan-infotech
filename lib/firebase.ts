"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

/** Same Storage bucket as admin-dashboard — upload from CMS UIs. */
const firebaseConfig = {
  apiKey: "AIzaSyAXuTDYp0Yxy6rLtNlhFH404v2OReFUAvY",
  authDomain: "odsportal-80582.firebaseapp.com",
  projectId: "odsportal-80582",
  storageBucket: "odsportal-80582.firebasestorage.app",
  messagingSenderId: "641917993181",
  appId: "1:641917993181:web:d5e0992302dc45a14f5b34",
  measurementId: "G-M87XRC4FVG",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { app, storage };
