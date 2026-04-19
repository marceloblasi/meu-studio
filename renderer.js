// UI Elements
const btnNavList = document.getElementById('btn-nav-list');
const btnNavAdd = document.getElementById('btn-nav-add');
const viewList = document.getElementById('view-list');
const viewForm = document.getElementById('view-form');
const formTitle = document.getElementById('form-title');
const btnEmptyAdd = document.getElementById('btn-empty-add');

const clientForm = document.getElementById('client-form');
const clientsTbody = document.getElementById('clients-tbody');
const emptyState = document.getElementById('empty-state');
const tableClients = document.querySelector('.clients-table');
const searchInput = document.getElementById('search-input');
const btnCancel = document.getElementById('btn-cancel');

// Agenda Elements
const btnNavAgenda = document.getElementById('btn-nav-agenda');
const viewAgenda = document.getElementById('view-agenda');
const agendaForm = document.getElementById('agenda-form');
const agendaClienteSelect = document.getElementById('agenda-cliente');
const agendaServicoSelect = document.getElementById('agenda-servico');
const agendaValorInput = document.getElementById('agenda-valor');
const agendaListContainer = document.getElementById('agenda-list-container');
const agendaEmptyState = document.getElementById('agenda-empty-state');

// Servicos Elements
const btnNavServicos = document.getElementById('btn-nav-servicos');
const viewServicos = document.getElementById('view-servicos');
const servicoForm = document.getElementById('servico-form');
const servicosTbody = document.getElementById('servicos-tbody');
const servicoNome = document.getElementById('servico-nome');
const servicoValor = document.getElementById('servico-valor');
const servicoId = document.getElementById('servico-id');
const btnSaveServico = document.getElementById('btn-save-servico');
const btnCancelServico = document.getElementById('btn-cancel-servico');
const formServicoTitle = document.getElementById('form-servico-title');

// Finance Elements
const btnNavFinance = document.getElementById('btn-nav-finance');
const viewFinance = document.getElementById('view-finance');
const dashFaturamento = document.getElementById('dash-faturamento');
const dashServicos = document.getElementById('dash-servicos');

const filterFinanceCliente = document.getElementById('filter-finance-cliente');
const filterFinanceServico = document.getElementById('filter-finance-servico');
const filterFinanceDataInicio = document.getElementById('filter-finance-data-inicio');
const filterFinanceDataFim = document.getElementById('filter-finance-data-fim');

// State
let clientsList = [];

// Navigation Functions
function navigateTo(view) {
    // Reset classes
    btnNavList.classList.remove('active');
    btnNavAdd.classList.remove('active');
    btnNavAgenda.classList.remove('active');
    btnNavFinance.classList.remove('active');
    btnNavServicos.classList.remove('active');
    viewList.classList.remove('active');
    viewForm.classList.remove('active');
    viewAgenda.classList.remove('active');
    viewFinance.classList.remove('active');
    viewServicos.classList.remove('active');

    if (view === 'list') {
        btnNavList.classList.add('active');
        viewList.classList.add('active');
        loadClients();
    } else if (view === 'form') {
        btnNavAdd.classList.add('active');
        viewForm.classList.add('active');
    } else if (view === 'agenda') {
        btnNavAgenda.classList.add('active');
        viewAgenda.classList.add('active');
        loadAgenda();
        populateAgendaClients();
        populateServicosDropdowns();
    } else if (view === 'finance') {
        btnNavFinance.classList.add('active');
        viewFinance.classList.add('active');
        populateFinanceClients();
        populateServicosDropdowns();
        updateFinance();
    } else if (view === 'servicos') {
        btnNavServicos.classList.add('active');
        viewServicos.classList.add('active');
        loadServicos();
    }
}

function openAddForm() {
    clientForm.reset();
    document.getElementById('client-id').value = '';
    formTitle.textContent = 'Cadastrar Cliente';
    navigateTo('form');
}

// Event Listeners - Navigation
btnNavList.addEventListener('click', () => navigateTo('list'));
btnNavAdd.addEventListener('click', openAddForm);
btnNavAgenda.addEventListener('click', () => navigateTo('agenda'));
btnNavFinance.addEventListener('click', () => navigateTo('finance'));
btnNavServicos.addEventListener('click', () => navigateTo('servicos'));
btnEmptyAdd.addEventListener('click', openAddForm);
btnCancel.addEventListener('click', () => navigateTo('list'));

// Load and Render Clients
async function loadClients() {
    clientsList = await window.api.getClients();
    renderClients(clientsList);
}

function renderClients(clientsToRender) {
    clientsTbody.innerHTML = '';
    
    if (clientsList.length === 0) {
        tableClients.style.display = 'none';
        emptyState.classList.remove('hidden');
        return;
    }
    
    tableClients.style.display = 'table';
    emptyState.classList.add('hidden');
    
    if (clientsToRender.length === 0) {
        clientsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhuma cliente encontrada com essa busca.</td></tr>`;
        return;
    }

    clientsToRender.forEach(client => {
        const tr = document.createElement('tr');
        
        // Serviços HTML
        let servicosHtml = '';
        if (client.servicos && client.servicos.length > 0) {
            client.servicos.forEach(srv => {
                servicosHtml += `<span class="tag-servico">${srv}</span>`;
            });
        } else {
            servicosHtml = '-';
        }

        // Inadimplencia HTML
        const inadimplenciaHtml = client.inadimplencia 
            ? `<span class="badge-danger">Sim</span>`
            : `<span class="badge-ok">Não</span>`;

        // Data formatter
        const ultimaVisitaRaw = client.ultimaVisita;
        let ultimaVisitaFormated = '-';
        if (ultimaVisitaRaw) {
            const parts = ultimaVisitaRaw.split('-');
            if(parts.length === 3) {
                 ultimaVisitaFormated = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }

        tr.innerHTML = `
            <td><strong>${client.nome}</strong></td>
            <td>${client.telefone || '-'}</td>
            <td>${ultimaVisitaFormated}</td>
            <td>${servicosHtml}</td>
            <td>${inadimplenciaHtml}</td>
            <td>
                <button class="action-btn edit" onclick="editClient('${client.id}')">Editar</button>
                <button class="action-btn delete" onclick="deleteClient('${client.id}')">Excluir</button>
            </td>
        `;
        clientsTbody.appendChild(tr);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = clientsList.filter(c => 
        (c.nome && c.nome.toLowerCase().includes(term)) ||
        (c.cpf && c.cpf.includes(term))
    );
    renderClients(filtered);
});

// Form Submit Handler
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Pegar multiselect (checkboxs de serviços)
    const servicosCheckbox = document.querySelectorAll('input[name="servicos"]:checked');
    const servicos = Array.from(servicosCheckbox).map(cb => cb.value);

    const clientData = {
        id: document.getElementById('client-id').value || null,
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        ultimaVisita: document.getElementById('ultimaVisita').value,
        servicos: servicos,
        inadimplencia: document.getElementById('inadimplencia').checked
    };

    const response = await window.api.saveClient(clientData);
    if (response.success) {
        // Redirecionar para lista
        navigateTo('list');
        clientForm.reset();
    } else {
        alert("Erro ao salvar cliente: " + response.error);
    }
});

// Edit function (Global so onClick works)
window.editClient = (id) => {
    const client = clientsList.find(c => c.id === id);
    if (!client) return;

    document.getElementById('client-id').value = client.id;
    document.getElementById('nome').value = client.nome;
    document.getElementById('telefone').value = client.telefone;
    document.getElementById('cpf').value = client.cpf || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('ultimaVisita').value = client.ultimaVisita || '';
    document.getElementById('inadimplencia').checked = client.inadimplencia;

    // Reset and select checkboxes
    document.querySelectorAll('input[name="servicos"]').forEach(cb => {
        cb.checked = client.servicos && client.servicos.includes(cb.value);
    });

    formTitle.textContent = 'Editar Cliente';
    navigateTo('form');
};

// Delete function (Global so onClick works)
window.deleteClient = async (id) => {
    if(confirm('Tem certeza que deseja excluir esta cliente?')){
        const response = await window.api.deleteClient(id);
        if(response.success) {
            loadClients();
        } else {
            alert('Erro ao excluir: ' + response.error);
        }
    }
};

// ======================== AGENDA LOGIC ========================

let servicosListLocal = [];

async function populateServicosDropdowns() {
    servicosListLocal = await window.api.getServicos();
    let optionsHtml = '<option value="" disabled selected>Selecione um serviço...</option>';
    let filterOptionsHtml = '<option value="">Todos os Serviços</option>';
    let checkboxesHtml = '';
    
    servicosListLocal.forEach(s => {
        optionsHtml += `<option value="${s.nome}">${s.nome}</option>`;
        filterOptionsHtml += `<option value="${s.nome}">${s.nome}</option>`;
        checkboxesHtml += `
            <label class="custom-checkbox">
                <input type="checkbox" name="servicos" value="${s.nome}">
                <span class="checkmark"></span>
                ${s.nome}
            </label>
        `;
    });
    
    if(agendaServicoSelect) agendaServicoSelect.innerHTML = optionsHtml;
    if(filterFinanceServico) filterFinanceServico.innerHTML = filterOptionsHtml;
    
    const clientCheckboxes = document.getElementById('client-servicos-checkboxes');
    if(clientCheckboxes) clientCheckboxes.innerHTML = checkboxesHtml;
}

if(agendaServicoSelect) {
    agendaServicoSelect.addEventListener('change', (e) => {
        const selectedSrvName = e.target.value;
        const srv = servicosListLocal.find(s => s.nome === selectedSrvName);
        if (srv && agendaValorInput) {
            agendaValorInput.value = parseFloat(srv.valor).toFixed(2);
        }
    });
}

async function populateAgendaClients() {
    clientsList = await window.api.getClients();
    let optionsHtml = '<option value="" disabled selected>Selecione uma cliente...</option>';
    clientsList.forEach(c => {
        optionsHtml += `<option value="${c.id}">${c.nome}</option>`;
    });
    agendaClienteSelect.innerHTML = optionsHtml;
}

async function loadAgenda() {
    const agendaList = await window.api.getAgenda();
    renderAgenda(agendaList);
}

function renderAgenda(agendaList) {
    agendaListContainer.innerHTML = '';
    
    if (agendaList.length === 0) {
        agendaEmptyState.classList.remove('hidden');
        return;
    }
    
    agendaEmptyState.classList.add('hidden');
    
    agendaList.forEach(agenda => {
        // Find client
        const client = clientsList.find(c => c.id === agenda.clienteId);
        const clientName = client ? client.nome : 'Cliente Deletada';
        const clientPhone = client ? client.telefone : '';

        // Formata Data
        const parts = agenda.data.split('-');
        let dataFormated = agenda.data;
        if(parts.length === 3) dataFormated = `${parts[2]}/${parts[1]}`;

        // Valor
        const valorFormatado = parseFloat(agenda.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

        // Actions UI
        let actionsHtml = '';
        let badgeHtml = '';
        if (agenda.concluido) {
            badgeHtml = `<span class="badge-concluido">✔ Concluído</span>`;
            actionsHtml = `<button class="action-btn delete" style="margin-left: 10px; font-size: 16px;" onclick="deleteAgenda('${agenda.id}')" title="Excluir Histórico">✖</button>`;
        } else {
            actionsHtml = `
                <button class="btn-success" onclick="completeAgenda('${agenda.id}')">✔ Concluir</button>
                <button class="action-btn delete" style="font-size: 16px;" onclick="deleteAgenda('${agenda.id}')" title="Cancelar Agendamento">✖</button>
            `;
        }

        const div = document.createElement('div');
        div.className = 'agenda-item';
        div.innerHTML = `
            <div class="agenda-info">
                <h4>${clientName} - ${agenda.servico} ${badgeHtml}</h4>
                <span>📱 ${clientPhone || 'Sem telefone'} | ${valorFormatado}</span>
            </div>
            <div class="agenda-time">
                ${dataFormated} às ${agenda.hora}
                <div style="margin-top: 5px;">
                    ${actionsHtml}
                </div>
            </div>
        `;
        agendaListContainer.appendChild(div);
    });
}

agendaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obter data original para manter 'concluido' ou criar caso seja novo
    const id = document.getElementById('agenda-id').value || null;
    let concluido = false;
    
    const agendaData = {
        id: id,
        clienteId: document.getElementById('agenda-cliente').value,
        servico: document.getElementById('agenda-servico').value,
        data: document.getElementById('agenda-data').value,
        hora: document.getElementById('agenda-hora').value,
        valor: document.getElementById('agenda-valor').value,
        concluido: concluido
    };

    const response = await window.api.saveAgenda(agendaData);
    if (response.success) {
        agendaForm.reset();
        document.getElementById('agenda-id').value = '';
        loadAgenda(); // recarrega a lista
    } else {
        alert("Erro ao salvar: " + response.error);
    }
});

window.deleteAgenda = async (id) => {
    if(confirm('Tem certeza que deseja apagar este agendamento?')){
        const response = await window.api.deleteAgenda(id);
        if(response.success) {
            loadAgenda();
        } else {
            alert('Erro ao apagar: ' + response.error);
        }
    }
};

window.completeAgenda = async (id) => {
    const agendaList = await window.api.getAgenda();
    const agenda = agendaList.find(a => a.id === id);
    if (agenda) {
        agenda.concluido = true;
        await window.api.saveAgenda(agenda);
        loadAgenda();
    }
};

// ======================== FINANCE LOGIC ========================

async function populateFinanceClients() {
    clientsList = await window.api.getClients();
    let optionsHtml = '<option value="">Todas as Clientes</option>';
    clientsList.forEach(c => {
        optionsHtml += `<option value="${c.id}">${c.nome}</option>`;
    });
    if (filterFinanceCliente) filterFinanceCliente.innerHTML = optionsHtml;
}

if (filterFinanceCliente) {
    [filterFinanceCliente, filterFinanceServico, filterFinanceDataInicio, filterFinanceDataFim].forEach(el => {
        el.addEventListener('change', updateFinance);
        el.addEventListener('input', updateFinance);
    });
}

async function updateFinance() {
    const agendaList = await window.api.getAgenda();
    
    const fClient = filterFinanceCliente ? filterFinanceCliente.value : '';
    const fServ = filterFinanceServico ? filterFinanceServico.value : '';
    const fStart = filterFinanceDataInicio ? filterFinanceDataInicio.value : '';
    const fEnd = filterFinanceDataFim ? filterFinanceDataFim.value : '';

    let soma = 0;
    let qtd = 0;
    
    agendaList.forEach(a => {
        if(!a.concluido) return;

        if (fClient && a.clienteId !== fClient) return;
        if (fServ && a.servico !== fServ) return;
        if (fStart && a.data < fStart) return;
        if (fEnd && a.data > fEnd) return;

        soma += parseFloat(a.valor || 0);
        qtd++;
    });
    
    dashFaturamento.textContent = soma.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    dashServicos.textContent = qtd;
}

// ======================== SERVICOS (CRUD) LOGIC ========================

async function loadServicos() {
    servicosListLocal = await window.api.getServicos();
    renderServicos(servicosListLocal);
}

function renderServicos(list) {
    servicosTbody.innerHTML = '';
    if(list.length === 0) {
        servicosTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum serviço cadastrado.</td></tr>`;
        return;
    }
    list.forEach(s => {
        const tr = document.createElement('tr');
        const valorFormatado = parseFloat(s.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        tr.innerHTML = `
            <td><strong>${s.nome}</strong></td>
            <td>${valorFormatado}</td>
            <td>
                <button class="action-btn edit" onclick="editServico('${s.id}')">Editar</button>
                <button class="action-btn delete" onclick="deleteServico('${s.id}')">Excluir</button>
            </td>
        `;
        servicosTbody.appendChild(tr);
    });
}

function resetServicoForm() {
    servicoForm.reset();
    servicoId.value = '';
    btnCancelServico.style.display = 'none';
    btnSaveServico.textContent = 'Salvar Serviço';
    formServicoTitle.textContent = 'Cadastrar Novo';
}

if(btnCancelServico) {
    btnCancelServico.addEventListener('click', resetServicoForm);
}

servicoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        id: servicoId.value || null,
        nome: servicoNome.value,
        valor: servicoValor.value
    };
    const res = await window.api.saveServico(data);
    if(res.success) {
        resetServicoForm();
        loadServicos();
        populateServicosDropdowns(); 
    } else {
        alert("Erro: " + res.error);
    }
});

window.deleteServico = async (id) => {
    if(confirm('Tem certeza que deseja excluir este serviço do portfólio?')) {
        const res = await window.api.deleteServico(id);
        if(res.success) {
            loadServicos();
            populateServicosDropdowns();
        } else {
            alert('Erro: ' + res.error);
        }
    }
};

window.editServico = (id) => {
    const srv = servicosListLocal.find(s => s.id === id);
    if(srv) {
        servicoId.value = srv.id;
        servicoNome.value = srv.nome;
        servicoValor.value = srv.valor;
        btnCancelServico.style.display = 'block';
        btnSaveServico.textContent = 'Atualizar Serviço';
        formServicoTitle.textContent = 'Editar Serviço';
    }
};

// Initialize
loadClients();
populateServicosDropdowns();
