// Endereço da nossa API backend
// Todas as requisições (GET, POST, DELETE) irão para essa URL
const api = "/api/alunos";


// ===============================
// FUNÇÃO PARA CADASTRAR ALUNO
// ===============================
function cadastrarAluno() {

    // Captura os valores digitados nos inputs do HTML
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const curso = document.getElementById("curso").value;

    // Validação simples: impede envio com campo vazio
    if (!nome || !idade || !curso) {
        alert("Preencha todos os campos!");
        return; // Interrompe a função
    }

    // Faz requisição HTTP para a API usando fetch
    fetch(api, {

        // Método HTTP usado para criar um novo registro
        method: "POST",

        // Cabeçalho informando que estamos enviando JSON
        headers: {
            "Content-Type": "application/json"
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
    });
}



// ===============================
// FUNÇÃO PARA LISTAR ALUNOS
// ===============================
function listarAlunos() {

    // Faz requisição GET para buscar todos os alunos
    fetch(api)
    .then(res => res.json()) // Converte resposta para JSON
    .then(alunos => {

        // Pega o elemento <tbody> da tabela
        const tabela = document.getElementById("tabelaAlunos");

        // Limpa a tabela antes de preencher novamente
        tabela.innerHTML = "";

        // Para cada aluno retornado do banco
        alunos.forEach(aluno => {

            // Adiciona uma nova linha na tabela
            tabela.innerHTML += `
                <tr>
                    <td>${aluno.id}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.curso}</td>
                    <td>
                        <button onclick="deletarAluno(${aluno.id})">
                            Excluir
                        </button>
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

    // Faz requisição DELETE passando o ID na URL
    fetch(`${api}/${id}`, {
        method: "DELETE"
    })
    .then(() => {

        // Após deletar, atualiza a lista novamente
        listarAlunos();
    });
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