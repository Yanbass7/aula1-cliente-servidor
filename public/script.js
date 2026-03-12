// Endereço da nossa API backend
// Todas as requisições (GET, POST, DELETE) irão para essa URL
const api = "/api/alunos";

// ===============================
// CONTROLE DE AUTENTICAÇÃO
// ===============================
function checkAuth() {
    const loggedUser = localStorage.getItem("loggedUser");
    const userRole = localStorage.getItem("userRole") || "user";

    if (!loggedUser) {
        // Se não estiver logado, volta para a landing page
        window.location.href = "login.html";
        return;
    }

    // Atualiza a informação de usuário na barra superior
    const userEmailSpan = document.getElementById("user-email");
    if (userEmailSpan) {
        userEmailSpan.textContent = loggedUser;
    }

    // Exibe papel do usuário no console para debug (opcional)
    console.log("Usuário logado:", loggedUser, "Role:", userRole);
}

function logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}

// Executa verificação de login assim que o script carregar
checkAuth();


// ===============================
// FUNÇÃO PARA CADASTRAR ALUNO
// ===============================
function cadastrarAluno() {

    // Captura os valores digitados nos inputs do HTML
    const id = document.getElementById("alunoId").value;
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const curso = document.getElementById("curso").value;

    // Validação simples: impede envio com campo vazio
    if (!nome || !idade || !curso) {
        alert("Preencha todos os campos!");
        return; // Interrompe a função
    }

    const token = localStorage.getItem("authToken");

    const url = id ? `${api}/${id}` : api;
    const method = id ? "PUT" : "POST";

    // Faz requisição HTTP para a API usando fetch
    fetch(url, {

        // Método HTTP usado para criar ou atualizar registro
        method,

        // Cabeçalho informando que estamos enviando JSON + token
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        // Converte o objeto JavaScript em JSON
        body: JSON.stringify({ nome, idade, curso })
    })
    .then(res => res.json()) // Converte a resposta para JSON
    .then(() => {

        // Atualiza a lista de alunos após cadastrar
        listarAlunos();

        // Limpa os campos do formulário
        limparCampos();
        // Reseta estado de edição
        document.getElementById("alunoId").value = "";
        const btn = document.getElementById("btnSalvar");
        if (btn) btn.textContent = "Cadastrar";
    });
}



// ===============================
// FUNÇÃO PARA LISTAR ALUNOS
// ===============================
function listarAlunos() {

    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole") || "user";

    // Faz requisição GET para buscar todos os alunos
    fetch(api, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json()) // Converte resposta para JSON
    .then(alunos => {

        // Pega o elemento <tbody> da tabela
        const tabela = document.getElementById("tabelaAlunos");

        // Limpa a tabela antes de preencher novamente
        tabela.innerHTML = "";

        // Para cada aluno retornado do banco
        alunos.forEach(aluno => {

            // Adiciona uma nova linha na tabela
            const botoes = `
                <button class="btn-edit" onclick="editarAluno(${aluno.id}, '${aluno.nome.replace(/'/g, "\\'")}', ${aluno.idade}, '${aluno.curso.replace(/'/g, "\\'")}')">
                    Editar
                </button>
                ${userRole === "admin" ? `<button class="btn-delete" onclick="deletarAluno(${aluno.id})">Excluir</button>` : ""}
            `;

            tabela.innerHTML += `
                <tr>
                    <td>${aluno.id}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.curso}</td>
                    <td>
                        ${botoes}
                    </td>
                </tr>
            `;
        });
    });
}



// ===============================
// FUNÇÃO PARA DELETAR ALUNO
// ===============================
function deletarAluno(id) {

    const token = localStorage.getItem("authToken");

    // Faz requisição DELETE passando o ID na URL
    fetch(`${api}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(() => {

        // Após deletar, atualiza a lista novamente
        listarAlunos();
    });
}

// ===============================
// FUNÇÃO PARA EDITAR ALUNO
// ===============================
function editarAluno(id, nome, idade, curso) {
    document.getElementById("alunoId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("idade").value = idade;
    document.getElementById("curso").value = curso;

    const btn = document.getElementById("btnSalvar");
    if (btn) btn.textContent = "Salvar";
}



// ===============================
// FUNÇÃO PARA LIMPAR OS CAMPOS
// ===============================
function limparCampos() {

    // Define valor vazio para cada input
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("curso").value = "";
}



// ===============================
// CARREGA A LISTA ASSIM QUE A PÁGINA ABRE
// ===============================

// Quando o navegador carregar a página,
// essa função será executada automaticamente
listarAlunos();