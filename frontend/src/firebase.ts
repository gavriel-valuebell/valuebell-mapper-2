import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBjxQEKc7sQW7KYVDYLv6qOyOh-YFhXKUE",
  authDomain: "valuebell-production.firebaseapp.com",
  projectId: "valuebell-production",
  storageBucket: "valuebell-production.firebasestorage.app",
  messagingSenderId: "115346807311",
  appId: "1:115346807311:web:3a85e25ddc95590f13617a"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
