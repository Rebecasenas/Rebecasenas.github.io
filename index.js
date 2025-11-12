/***********************************************
 * index.js - Versão com login + logout + bloqueio de acesso
 * - Abas só habilitam após login
 * - Botão “Sair” encerra sessão e bloqueia tudo novamente
 ***********************************************/

function updateCadastroIcon(subName) {
  const headerImg = document.getElementById("cadastroIcon");
  if (!headerImg) return;
  if (subName === "funcionarios") headerImg.src = "icon-cadastro.png";
  else if (subName === "livros" || subName === "alugueis") headerImg.src = "icon-livros.png";
  else headerImg.src = "icon-cadastro.png";
}

function updateListIcon(listName) {
  const headerImg = document.getElementById("listagemIcon");
  if (!headerImg) return;
  if (listName === "funcList") headerImg.src = "icon-list-novo.png";
  else if (listName === "livroList") headerImg.src = "icon-list-livros.png";
  else if (listName === "aluguelList") headerImg.src = "icon-list-aluguel.png";
  else headerImg.src = "icon-list-novo.png";
}

// -----------------------
// Navegação de abas
// -----------------------
function openTab(event, tabName) {
  const contents = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-buttons .tab-btn");
  const dropdownMenus = document.querySelectorAll(".dropdown-menu");

  contents.forEach((c) => c.classList.remove("active"));
  buttons.forEach((b) => b.classList.remove("active"));
  dropdownMenus.forEach((d) => d.classList.remove("active"));

  const target = document.getElementById(tabName);
  if (target) target.classList.add("active");

  if (event?.currentTarget?.classList.contains("tab-btn")) {
    event.currentTarget.classList.add("active");
  }

  const parentDropdown = event?.currentTarget?.closest(".dropdown-menu");
  if (parentDropdown) parentDropdown.classList.add("active");
}

function openSub(event, subName) {
  document.querySelectorAll("#cadastro .sub-content").forEach((s) => (s.style.display = "none"));
  const el = document.getElementById("sub-" + subName);
  if (el) el.style.display = "block";

  const title = {
    funcionarios: "Cadastro de Funcionário",
    livros: "Cadastro de Livros",
    alugueis: "Aluguel",
  }[subName];
  document.getElementById("cadastroTitle").textContent = title || "Cadastro";
  updateCadastroIcon(subName);
}

function openList(event, listName) {
  document.querySelectorAll("#listagem .list-block").forEach((l) => (l.style.display = "none"));
  const el = document.getElementById(listName);
  if (el) el.style.display = "block";

  const titleMap = {
    funcList: "Listagem de Funcionários",
    livroList: "Listagem de Livros",
    aluguelList: "Listagem de Aluguéis",
  };
  document.getElementById("listagemTitle").textContent = titleMap[listName] || "Listagem";
  updateListIcon(listName);

  if (listName === "funcList") carregarFuncionarios();
  if (listName === "livroList") carregarLivros();
  if (listName === "aluguelList") carregarAlugueis();
}

// ----------------------------
// Inicialização e eventos
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("📘 Frontend inicializado.");

  const mainButtonsSimple = document.querySelectorAll(".tab-buttons > .tab-btn");
  const dropdownMenus = document.querySelectorAll(".dropdown-menu");
  const subButtons = document.querySelectorAll(".dropdown-content .sub-btn");

  const cadastroTab = document.querySelector("[data-tab='cadastro']");
  const listagemTab = document.querySelector("[data-tab='listagem']");
  const isLoggedIn = localStorage.getItem("bibliotechLoggedIn") === "true";

  // 🔒 Controle visual
  function toggleTabsAccess(loggedIn) {
    [cadastroTab, listagemTab].forEach((tab) => {
      if (!tab) return;
      tab.style.pointerEvents = loggedIn ? "auto" : "none";
      tab.style.opacity = loggedIn ? "1" : "0.5";
    });
  }
  toggleTabsAccess(isLoggedIn);

  // 🔐 Adiciona botão de logout se estiver logado
  if (isLoggedIn) {
    const header = document.querySelector(".tabs-wrapper");
    if (header && !document.getElementById("logoutBtn")) {
      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logoutBtn";
      logoutBtn.textContent = "Sair";
      logoutBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 40px;
        background: #072548;
        color: #fff;
        border: none;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: background 0.3s ease;
      `;
      logoutBtn.addEventListener("mouseenter", () => logoutBtn.style.background = "#0b3158");
      logoutBtn.addEventListener("mouseleave", () => logoutBtn.style.background = "#072548");

      logoutBtn.addEventListener("click", () => {
        if (confirm("Deseja realmente sair?")) {
          localStorage.removeItem("bibliotechLoggedIn");
          alert("Sessão encerrada. Até logo!");
          location.reload();
        }
      });
      header.appendChild(logoutBtn);
    }
  }

  // 🔒 Bloqueio total do conteúdo se não logado
  if (!isLoggedIn) {
    document.querySelectorAll("#cadastro, #listagem").forEach(section => {
      section.innerHTML = `
        <div style="text-align:center; padding:60px;">
          <h2 style="color:#072548; font-size:1.8rem;">🔐 Acesso restrito</h2>
          <p style="color:#333; font-size:1.1rem;">Efetue o login como administrador para visualizar esta área.</p>
        </div>
      `;
    });
  }

  function closeAllDropdowns() {
    dropdownMenus.forEach((d) => d.classList.remove("active"));
  }

  mainButtonsSimple.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = e.currentTarget.dataset.tab;
      if (!e.currentTarget.closest(".dropdown-menu")) {
        closeAllDropdowns();
        if (tabName) openTab({ currentTarget: button }, tabName);
      }
    });
  });

  dropdownMenus.forEach((menu) => {
    const mainButton = menu.querySelector(".tab-btn");
    const tabName = mainButton.dataset.tab;

    menu.addEventListener("mouseenter", () => {
      closeAllDropdowns();
      if (tabName) openTab({ currentTarget: mainButton }, tabName);
      const firstSubBtn = menu.querySelector(".sub-btn:first-child");
      if (firstSubBtn) firstSubBtn.click();
    });
  });

  subButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const parentMenu = e.currentTarget.closest(".dropdown-menu");
      const parentTab = parentMenu?.dataset.targetTab;

      parentMenu.querySelectorAll(".sub-btn").forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      if (parentTab === "cadastro") {
        const subName = e.currentTarget.dataset.sub;
        if (subName) openSub(e, subName);
      } else if (parentTab === "listagem") {
        const listName = e.currentTarget.dataset.list;
        if (listName) openList(e, listName);
      }
    });
  });

  // Aba inicial
  const initialButton = document.querySelector(".tab-btn.active");
  if (initialButton) {
    const initialTab = initialButton.dataset.tab;
    if (initialTab) openTab({ currentTarget: initialButton }, initialTab);
  }

  // CHAMADAS AUTOMÁTICAS DE LISTAGEM
  carregarFuncionarios();
  carregarLivros();
  carregarAlugueis();

  // 🔐 Bloqueia formulários se não logado
  if (!isLoggedIn) {
    document.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Acesso concedido.");
      });
    });
  }

  // CADASTROS -----------------------
  document.getElementById("formFuncionario")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nome: nome.value,
      cpf: cpf.value,
      email: email.value,
      endereco: endereco.value,
      telefone: telefone.value,
    };
    const res = await fetch("http://localhost:3000/api/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || "Erro ao cadastrar funcionário");
    await carregarFuncionarios();
  });

  document.getElementById("formLivro")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      titulo: titulo.value,
      editora: editora.value,
      autor: autor.value,
      genero: genero.value,
      ano: ano.value,
    };
    const res = await fetch("http://localhost:3000/api/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || "Erro ao cadastrar livro");
    await carregarLivros();
  });

  document.getElementById("formAluguel")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      email: aluguelEmail.value,
      livro: aluguelLivro.value,
    };
    const res = await fetch("http://localhost:3000/api/alugueis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || "Erro ao registrar aluguel");
    await carregarAlugueis();
  });
});

// LOGIN -----------------------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginUser.value.trim();
  const senha = loginPass.value.trim();
  if (!email || !senha) return alert("Preencha e-mail e senha.");

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    let result = {};
    try { result = await res.json(); } catch {}

    if (res.ok) {
      alert(result.message || "Login realizado com sucesso!");
      localStorage.setItem("bibliotechLoggedIn", "true");
      location.reload(); // recarrega e libera abas
    } else {
      alert(result.message || "E-mail ou senha incorretos.");
      localStorage.removeItem("bibliotechLoggedIn");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro ao tentar fazer login. Verifique o servidor.");
  }
});

// LISTAGENS -----------------------
async function carregarFuncionarios() {
  const tabela = document.getElementById("tabelaFuncionarios");
  if (!tabela) return;
  tabela.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

  try {
    const res = await fetch("http://localhost:3000/api/funcionarios");
    const data = await res.json();
    tabela.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tabela.innerHTML = "<tr><td colspan='6'>Nenhum funcionário encontrado.</td></tr>";
      return;
    }

    data.forEach((f) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.nome}</td>
        <td>${f.cpf}</td>
        <td>${f.email}</td>
        <td>${f.endereco}</td>
        <td>${f.telefone}</td>`;
      tabela.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar funcionários:", err);
  }
}

async function carregarLivros() {
  const tabela = document.getElementById("tabelaLivros");
  const select = document.getElementById("aluguelLivro");
  if (!tabela) return;
  tabela.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

  try {
    const res = await fetch("http://localhost:3000/api/livros");
    const data = await res.json();
    tabela.innerHTML = "";
    select.innerHTML = '<option value="">SELECIONE UM LIVRO</option>';

    if (!Array.isArray(data) || data.length === 0) {
      tabela.innerHTML = "<tr><td colspan='5'>Nenhum livro encontrado.</td></tr>";
      return;
    }

    data.forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.titulo}</td>
        <td>${l.editora}</td>
        <td>${l.autor}</td>
        <td>${l.genero || ""}</td>
        <td style="color:${l.status === 'Inativo' ? 'red' : 'green'}">${l.status || 'Ativo'}</td>`;
      tabela.appendChild(tr);

      const opt = document.createElement("option");
      opt.value = l.titulo;
      opt.textContent = l.titulo;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar livros:", err);
  }
}

async function carregarAlugueis() {
  const tabela = document.getElementById("tabelaAlugueis");
  if (!tabela) return;
  try {
    const res = await fetch("http://localhost:3000/api/alugueis");
    const data = await res.json();
    tabela.innerHTML = "";
    const hoje = new Date();

    data.forEach((a) => {
      const dataPrevista = a.data_prevista_entrega ? new Date(a.data_prevista_entrega) : null;
      const dataEntrega = a.data_entrega ? new Date(a.data_entrega) : null;
      let status = "Ativo";
      let corStatus = "green";

      if (dataPrevista && dataPrevista < hoje && !dataEntrega) {
        status = "Vencido"; corStatus = "red";
      }
      if (dataEntrega && dataPrevista && dataEntrega <= dataPrevista) {
        status = "Devolvido"; corStatus = "gray";
      }
      if (dataEntrega && dataPrevista && dataEntrega > dataPrevista) {
        status = "Devolvido (Atrasado)"; corStatus = "orange";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.email}</td>
        <td>${a.livro}</td>
        <td>${a.data_prevista_entrega ? new Date(a.data_prevista_entrega).toLocaleDateString("pt-BR") : "--"}</td>
        <td>${a.data_entrega ? new Date(a.data_entrega).toLocaleDateString("pt-BR") : "--"}</td>
        <td style="color:${corStatus}; font-weight:600;">${status}</td>`;

      if (!a.data_entrega) {
        const tdBotao = document.createElement("td");
        const botao = document.createElement("button");
        botao.textContent = "Registrar Devolução";
        botao.classList.add("btn-submit");
        botao.style.marginLeft = "10px";
        botao.addEventListener("click", async () => {
          if (confirm("Deseja registrar a devolução deste livro?")) {
            const res = await fetch(`http://localhost:3000/api/alugueis/${a.id}/devolucao`, { method: "PUT" });
            const result = await res.json();
            alert(result.message);
            await carregarAlugueis();
          }
        });
        tdBotao.appendChild(botao);
        tr.appendChild(tdBotao);
      } else {
        tr.appendChild(document.createElement("td"));
      }
      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar aluguéis:", error);
    tabela.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar dados.</td></tr>';
  }
}
