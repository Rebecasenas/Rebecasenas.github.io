function openTab(event, tabName) {
  const contents = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-buttons button');

  contents.forEach(c => c.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ----------------------------
// CADASTRO DE FUNCIONÁRIOS
// ----------------------------
const formFuncionario = document.getElementById('formFuncionario');
const tabelaFuncionarios = document.getElementById('tabelaFuncionarios');

formFuncionario?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const endereco = document.getElementById('endereco').value;
  const telefone = document.getElementById('telefone').value;

  const novaLinha = `<tr>
    <td>${nome}</td>
    <td>${cpf}</td>
    <td>${email}</td>
    <td>${endereco}</td>
    <td>${telefone}</td>
  </tr>`;

  tabelaFuncionarios.innerHTML += novaLinha;
  formFuncionario.reset();
});

// ----------------------------
// CADASTRO DE LIVROS
// ----------------------------
const formLivro = document.getElementById('formLivro');
const tabelaLivros = document.getElementById('tabelaLivros');

formLivro?.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const editora = document.getElementById('editora').value;
  const ano = document.getElementById('ano').value;
  const isbn = document.getElementById('isbn').value;

  const novaLinha = `<tr>
    <td>${titulo}</td>
    <td>${autor}</td>
    <td>${editora}</td>
    <td>${ano}</td>
    <td>${isbn}</td>
  </tr>`;

  tabelaLivros.innerHTML += novaLinha;
  formLivro.reset();
});