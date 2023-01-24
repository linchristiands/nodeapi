import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyATxMsOvtLNJcrd3zWzhOBHjVvPt2Hnb0E",
  authDomain: "kubernetestest-373803.firebaseapp.com",
  projectId: "kubernetestest-373803",
  storageBucket: "kubernetestest-373803.appspot.com",
  messagingSenderId: "808725214266",
  appId: "1:808725214266:web:4e871be87b66e17ed67103",
  measurementId: "G-7CLDFSTVTH",
};

export const firebaseApp = initializeApp(firebaseConfig);