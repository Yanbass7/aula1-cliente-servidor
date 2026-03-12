function registerUser(event) {
  event.preventDefault();

  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerPasswordConfirm").value;

  if (!email || !password || !confirm) {
    alert("Preencha todos os campos de cadastro.");
    return;
  }

  if (password !== confirm) {
    alert("As senhas não conferem.");
    return;
  }

  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha: password })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao cadastrar usuário.");
      }
      // Salva token e e-mail e já entra no sistema
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("loggedUser", data.email);
      localStorage.setItem("userRole", data.role || "user");
      alert("Cadastro realizado com sucesso!");
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.message);
    });
}

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Preencha e-mail e senha para entrar.");
    return;
  }

  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha: password })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.mensagem || "Erro ao fazer login.");
      }
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("loggedUser", data.email);
      localStorage.setItem("userRole", data.role || "user");
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.message);
    });
}

// Se já estiver logado, manda direto para a página principal
function redirectIfLogged() {
  const logged = localStorage.getItem("loggedUser");
  if (logged) {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  redirectIfLogged();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
  }
});

