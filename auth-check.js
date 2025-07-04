import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxBMrWfE5-2BIdeNFd_5OGI47YC9lm6_s",
  authDomain: "nikusha-web.firebaseapp.com",
  projectId: "nikusha-web",
  storageBucket: "nikusha-web.appspot.com",
  messagingSenderId: "262614394157",
  appId: "1:262614394157:web:f9a6e9e7986d3bd8941fa4",
  measurementId: "G-NGHNKSV255"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const profileLink = document.getElementById("profile-link");
  const registerLink = document.getElementById("register-link");

  if (user) {
    // დალაგება მენიუში
    if (profileLink) profileLink.style.display = "inline-block";
    if (registerLink) registerLink.style.display = "none";

    // მომხმარებლის მისამართის გამოტანა და გასვლის ღილაკი
    let userDiv = document.getElementById("user-info-div");
    if (!userDiv) {
      userDiv = document.createElement("div");
      userDiv.id = "user-info-div";
      userDiv.style.textAlign = "center";
      userDiv.style.margin = "1rem 0";
      document.body.prepend(userDiv);
    }
    userDiv.innerHTML = `
      <p>მოგესალმებით, ${user.displayName || user.email}!</p>
      <button id="logout" class="btn">გასვლა</button>
    `;

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        signOut(auth).then(() => {
          window.location.href = "register.html";
        });
      };
    }

  } else {
    // მომხმარებელი არ არის შესული
    if (profileLink) profileLink.style.display = "none";
    if (registerLink) registerLink.style.display = "inline-block";

    // ავტომატური გადამისამართება, თუ არ ვართ register.html-ზე
    if (!window.location.href.includes("register.html")) {
      window.location.href = "register.html";
    }
  }
});

// პაროლის აღდგენის ლინკის ჰენდლერი
const forgotPasswordLink = document.getElementById("forgot-password-link");
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    const email = prompt("გთხოვთ შეიყვანოთ თქვენი რეგისტრირებული ელ.ფოსტა:");

    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("პაროლის აღდგენის ლინკი გაიგზავნა ელ.ფოსტაზე.");
        })
        .catch((error) => {
          alert("შეცდომა: " + error.message);
        });
    }
  });
}

// პაროლის შეცვლის ფორმის დამუშავება
const changePasswordForm = document.getElementById("change-password-form");
if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = changePasswordForm["new-password"].value;

    const user = auth.currentUser;
    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          alert("პაროლი წარმატებით შეიცვალა.");
          changePasswordForm.reset();
        })
        .catch((error) => {
          if (error.code === 'auth/requires-recent-login') {
            alert("დაგჭირდებათ თავიდან შესვლა პაროლის შესაცვლელად. გთხოვთ, გავიდეთ სისტემიდან და თავიდან შესვლა.");
          } else {
            alert("შეცდომა პაროლის შეცვლისას: " + error.message);
          }
        });
    } else {
      alert("მომხმარებელი არ არის ავტორიზებული.");
    }
  });
}
