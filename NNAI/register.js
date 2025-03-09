import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBLzI-HBC240GPj-lgUWT0ynMshtZfYwbE",
  authDomain: "netnanny-ai-c8243.firebaseapp.com",
  projectId: "netnanny-ai-c8243",
  storageBucket: "netnanny-ai-c8243.appspot.com",
  messagingSenderId: "1025708491681",
  appId: "1:1025708491681:web:6f946416a71a12549a41e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elements
const submitButton = document.getElementById('submit');
const toggleText = document.getElementById('toggle-form');
const formTitle = document.getElementById('form-title');
const statusDiv = document.getElementById('status');
const googleSignInBtn = document.getElementById('google-signin');
const logoutBtn = document.getElementById('logout');

let isLogin = true;

// Toggle between Login & Signup
toggleText?.addEventListener('click', () => {
  isLogin = !isLogin;

  formTitle.textContent = isLogin ? 'Login' : 'Create Account';
  submitButton.textContent = isLogin ? 'Login' : 'Create Account';
  toggleText.textContent = isLogin
    ? "Don't have an account? Create one"
    : "Already have an account? Login";

  statusDiv.textContent = '';
});

// Handle Login / Signup Button
submitButton?.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  if (isLogin) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Welcome back, ${user.email}!`);
        window.location.href = "main.html";
      })
      .catch((error) => {
        alert(`Login error: ${error.message}`);
      });
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Account created successfully! Please log in now.");
        // Switch back to login mode
        isLogin = true;
        formTitle.textContent = 'Login';
        submitButton.textContent = 'Login';
        toggleText.textContent = "Don't have an account? Create one";
      })
      .catch((error) => {
        alert(`Registration error: ${error.message}`);
      });
  }
});

// Google Sign-In
googleSignInBtn?.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Welcome ${user.displayName || user.email}!`);
      window.location.href = "main.html";
    })
    .catch((error) => {
      alert(`Google Sign-In error: ${error.message}`);
    });
});

// Logout Button (in main.html)
logoutBtn?.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully!");
      window.location.href = "index.html";  // Redirect to login
    })
    .catch((error) => {
      alert(`Logout error: ${error.message}`);
    });
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    statusDiv.textContent = `Logged in as: ${user.email}`;
  } else {
    statusDiv.textContent = "Not logged in.";
  }
});
