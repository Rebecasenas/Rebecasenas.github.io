/***********************************************
 * index.js - Versão corrigida e ajustada
 * - Mantém todas as funções originais
 * - Adiciona troca de ícone na Listagem de Aluguéis
 ***********************************************/

/* -----------------------
   Função global: troca o ícone do cadastro
   ----------------------- */
function updateCadastroIcon(subName) {
    try {
        const headerImg = document.getElementById('cadastroIcon');
        if (!headerImg) {
            console.warn('updateCadastroIcon: elemento #cadastroIcon não encontrado');
            return;
        }

        if (subName === 'funcionarios') {
            headerImg.src = 'icon-cadastro.png';
            headerImg.alt = 'ícone cadastro (funcionários)';
        } else if (subName === 'livros' || subName === 'alugueis') {
            const ts = Date.now();
            headerImg.src = `icon-livros.png?v=${ts}`;
            headerImg.alt = 'ícone livros';
        } else {
            headerImg.src = 'icon-cadastro.png';
            headerImg.alt = 'ícone cadastro (fallback)';
        }
    } catch (err) {
        console.error('Erro em updateCadastroIcon:', err);
    }
}

/* -----------------------
   Nova função: troca o ícone da listagem
   ----------------------- */
function updateListIcon(listName) {
    try {
        const headerImg = document.getElementById('listagemIcon');
        if (!headerImg) {
            console.warn('updateListIcon: elemento #listagemIcon não encontrado');
            return;
        }

        const ts = Date.now();

        if (listName === 'funcList') {
            headerImg.src = `icon-list-novo.png?v=${ts}`;
            headerImg.alt = 'ícone listagem de funcionários';
            headerImg.style.display = 'block';
        } else if (listName === 'livroList') {
            headerImg.src = `icon-list-livros.png?v=${ts}`;
            headerImg.alt = 'ícone listagem de livros';
            headerImg.style.display = 'block';
        } else if (listName === 'aluguelList') {
            headerImg.src = `icon-list-aluguel.png?v=${ts}`;
            headerImg.alt = 'ícone listagem de aluguéis';
            headerImg.style.display = 'block';
        } else {
            headerImg.src = `icon-list-novo.png?v=${ts}`;
            headerImg.alt = 'ícone padrão';
            headerImg.style.display = 'block';
        }

    } catch (err) {
        console.error('Erro em updateListIcon:', err);
    }
}

/* -----------------------
   Funções de navegação (mantidas)
   ----------------------- */
function openTab(event, tabName) {
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-buttons .tab-btn');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    contents.forEach(c => c.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));
    dropdownMenus.forEach(d => d.classList.remove('active'));

    const target = document.getElementById(tabName);
    if (target) target.classList.add('active');

    if (event && event.currentTarget && event.currentTarget.classList.contains('tab-btn')) {
        event.currentTarget.classList.add('active');
    }

    const parentDropdown = event && event.currentTarget ? event.currentTarget.closest('.dropdown-menu') : null;
    if (parentDropdown) parentDropdown.classList.add('active');
}

function openTabFromJs(tabName){
    const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (btn) {
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        btn.dispatchEvent(clickEvent);
    }
}

/* Sub abas (Cadastro) */
function openSub(event, subName) {
    const subs = document.querySelectorAll('#cadastro .sub-content');
    subs.forEach(s => s.style.display = 'none');

    const el = document.getElementById('sub-' + subName);
    if (el) el.style.display = 'block';

    const title = {
        funcionarios: 'Cadastro',
        livros: 'Cadastro de Livros',
        alugueis: 'Aluguel'
    }[subName];
    const h = document.getElementById('cadastroTitle');
    if (h && title) h.textContent = title;

    updateCadastroIcon(subName);
}

/* Listagem sub abas */
function openList(event, listName){
    const lists = document.querySelectorAll('#listagem .list-block');
    lists.forEach(l => l.style.display = 'none');

    const el = document.getElementById(listName);
    if (el) el.style.display = 'block';

    const titleMap = {
        funcList: 'Listagem de Funcionários',
        livroList: 'Listagem de Livros',
        aluguelList: 'Listagem de Aluguéis'
    };
    const t = document.getElementById('listagemTitle');
    if (t) t.textContent = titleMap[listName] || 'Listagem';

    // 🔹 Chama a função de atualização do ícone
    updateListIcon(listName);
}

/* ----------------------------
   DOMContentLoaded: listeners e inicialização
   ---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - inicializando scripts');

    const mainButtonsSimple = document.querySelectorAll('.tab-buttons > .tab-btn');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const subButtons = document.querySelectorAll('.dropdown-content .sub-btn');

    function closeAllDropdowns() {
        dropdownMenus.forEach(d => d.classList.remove('active'));
    }

    mainButtonsSimple.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = e.currentTarget.dataset.tab;
            if (!e.currentTarget.closest('.dropdown-menu')) {
                closeAllDropdowns();
                if (tabName) openTab({currentTarget: button}, tabName);
            }
        });
    });

    dropdownMenus.forEach(menu => {
        const mainButton = menu.querySelector('.tab-btn');
        const tabName = mainButton.dataset.tab;

        menu.addEventListener('mouseenter', (e) => {
            closeAllDropdowns();
            if (tabName) openTab({currentTarget: mainButton}, tabName);

            const initialSubBtn = menu.querySelector('.sub-btn.active') || menu.querySelector('.sub-btn:first-child');
            if (initialSubBtn) initialSubBtn.click();
        });

        if (document.getElementById(tabName)?.classList.contains('active')) {
            menu.classList.add('active');
        }
    });

    subButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const parentMenu = e.currentTarget.closest('.dropdown-menu');
            const parentTab = parentMenu?.dataset.targetTab;

            parentMenu.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            if (parentTab === 'cadastro') {
                const subName = e.currentTarget.dataset.sub;
                if (subName) openSub(e, subName);
            } else if (parentTab === 'listagem') {
                const listName = e.currentTarget.dataset.list;
                if (listName) openList(e, listName);
            }
        });
    });

    const initialTab = document.querySelector('.tab-buttons .tab-btn.active')?.dataset?.tab || 'login';
    if (initialTab) {
        const initialButton = document.querySelector(`.tab-btn[data-tab="${initialTab}"]`);
        if (initialButton) openTab({currentTarget: initialButton}, initialTab);
    }

    /* ---------- SEED DE TABELAS (mantido) ---------- */
    const tabelaFuncionarios = document.getElementById('tabelaFuncionarios');
    const tabelaLivros = document.getElementById('tabelaLivros');
    const tabelaAlugueis = document.getElementById('tabelaAlugueis');
    const aluguelSelect = document.getElementById('aluguelLivro');

    const funcionariosSeed = [
        { nome: 'Gabriela Lacerda', cpf: '111.111.111-11', email: 'gabriela@gmail.com', endereco: 'Rua da Alegria, 221', telefone: '11 94587-5634' },
        { nome: 'Rebeca Sena', cpf: '222.222.222-22', email: 'rebeca@gmail.com', endereco: 'Av. Leopoldina, 58', telefone: '11 95851-6987' }
    ];
    const livrosSeed = [
        { titulo:'Laravel', editora:'Novatec', autor:'Michael Douglas', genero:'', status:'Ativo' },
        { titulo:'Storytelling com Dados', editora:'Alta Books', autor:'Cole Nussbaumer Knaflic', genero:'Dados', status:'Ativo' }
    ];
    const alugueisSeed = [
        { nome:'Gabriela Lacerda', titulo:'Laravel', dataPrev:'10/11/2025', dataEntrega:'----------', status:'Ativo' },
        { nome:'Rebeca Sena', titulo:'Storytelling com dados', dataPrev:'20/10/2025', dataEntrega:'----------', status:'Ativo' }
    ];

    function renderFuncionarios(){
        tabelaFuncionarios.innerHTML = '';
        funcionariosSeed.forEach(f=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${f.nome}</td><td>${f.cpf}</td><td>${f.email}</td><td>${f.endereco}</td><td>${f.telefone}</td>`;
            tabelaFuncionarios.appendChild(tr);
        });
    }

    function renderLivros(){
        tabelaLivros.innerHTML = '';
        livrosSeed.forEach(l=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${l.titulo}</td><td>${l.editora}</td><td>${l.autor}</td><td>${l.genero||''}</td><td style="color:green">${l.status}</td>`;
            tabelaLivros.appendChild(tr);
        });

        if (aluguelSelect) {
            aluguelSelect.innerHTML = '<option value="">SELECIONE UM LIVRO</option>';
            livrosSeed.forEach(l=>{
                const opt = document.createElement('option');
                opt.value = l.titulo;
                opt.textContent = l.titulo;
                aluguelSelect.appendChild(opt);
            });
        }
    }

    function renderAlugueis(){
        tabelaAlugueis.innerHTML = '';
        alugueisSeed.forEach(a=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${a.nome}</td><td>${a.titulo}</td><td>${a.dataPrev}</td><td>${a.dataEntrega}</td><td style="color:green">${a.status}</td>`;
            tabelaAlugueis.appendChild(tr);
        });
    }

    renderFuncionarios();
    renderLivros();
    renderAlugueis();
});
