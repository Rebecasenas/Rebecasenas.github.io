// Lista de funcionários (armazenados em memória)
let funcionarios = [];

// Função para trocar de aba
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    let tabbuttons = document.getElementsByClassName("tab-buttons")[0].children;

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    for (let i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// ==========================
// Cadastro de funcionários
// ==========================
const form = document.getElementById("formFuncionario");
const tabela = document.getElementById("tabelaFuncionarios");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Pega os valores do formulário
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;

    // Cria objeto funcionário com senha padrão
    const funcionario = {
        nome,
        cpf,
        email,
        endereco,
        telefone,
        senha: "Mudar@123"
    };

    // Adiciona no array
    funcionarios.push(funcionario);

    // Cria uma nova linha na tabela
    const row = tabela.insertRow();
    row.innerHTML = `
        <td>${nome}</td>
        <td>${cpf}</td>
        <td>${email}</td>
        <td>${endereco}</td>
        <td>${telefone}</td>
    `;

    // Limpa os campos
    form.reset();

    // Vai para a aba de listagem
    document.querySelectorAll(".tab-buttons button")[2].click();
});

// ==========================
// Login de funcionário
// ==========================
const formLogin = document.querySelector("#login form");

formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = formLogin.querySelector("input[type='text']").value;
    const senha = formLogin.querySelector("input[type='password']").value;

    // Verifica se existe funcionário com esse e-mail
    const funcionario = funcionarios.find(f => f.email === usuario);

    if (!funcionario) {
        alert("Usuário não encontrado!");
        return;
    }

    // Verifica a senha
    if (funcionario.senha !== senha) {
        alert("Senha incorreta!");
        return;
    }

    alert(`Bem-vindo, ${funcionario.nome}!`);
});
