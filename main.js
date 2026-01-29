import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyCWMFUyaQaWlZ2tP0hErkAyzZ6o6hagVdU",
  authDomain: "qml-ai.firebaseapp.com",
  projectId: "qml-ai",
  storageBucket: "qml-ai.appspot.com",
  messagingSenderId: "53596930341",
  appId: "1:53596930341:web:b9e22842d590b859d55acc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ELEMENTOS */
const login = document.getElementById("login");
const chat = document.getElementById("chat");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const msg = document.getElementById("msg");
const mensagens = document.getElementById("mensagens");

document.getElementById("btnRegister").onclick = async () => {
  if (!email.value || senha.value.length < 6) {
    alert("Senha mínima: 6 caracteres");
    return;
  }
  await createUserWithEmailAndPassword(auth, email.value, senha.value);
  alert("Conta criada, agora entra 👍");
};

document.getElementById("btnLogin").onclick = async () => {
  await signInWithEmailAndPassword(auth, email.value, senha.value);
  login.classList.add("hidden");
  chat.classList.remove("hidden");
  ouvirMensagens();
};

document.getElementById("btnSend").onclick = async () => {
  if (!msg.value) return;
  await addDoc(collection(db, "chat"), {
    u: auth.currentUser.email,
    m: msg.value,
    t: Date.now()
  });
  msg.value = "";
};

document.getElementById("btnLogout").onclick = async () => {
  await signOut(auth);
  location.reload();
};

function ouvirMensagens() {
  const q = query(collection(db, "chat"), orderBy("t"));
  onSnapshot(q, snap => {
    mensagens.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      mensagens.innerHTML += `<p><strong>${d.u}:</strong> ${d.m}</p>`;
    });
  });
}
