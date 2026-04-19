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

const calendarDate = document.getElementById('calendar-date');
const calendarDayLabel = document.getElementById('calendar-day-label');
const btnPrevDay = document.getElementById('btn-prev-day');
const btnNextDay = document.getElementById('btn-next-day');
const timelineContainer = document.getElementById('timeline-container');

const agendaModalOverlay = document.getElementById('agenda-modal-overlay');
const agendaForm = document.getElementById('agenda-form');
const agendaClienteSelect = document.getElementById('agenda-cliente');
const agendaServicoSelect = document.getElementById('agenda-servico');
const agendaValorInput = document.getElementById('agenda-valor');
const agendaDataInput = document.getElementById('agenda-data');
const agendaHoraInput = document.getElementById('agenda-hora');

const btnCloseAgendaModal = document.getElementById('btn-close-agenda-modal');
const btnDeleteAgendaModal = document.getElementById('btn-delete-agenda-modal');
const btnConcluirAgendaModal = document.getElementById('btn-concluir-agenda-modal');
const modalTimeLabel = document.getElementById('modal-time-label');

// Config Elements
const btnNavConfig = document.getElementById('btn-nav-config');
const viewConfig = document.getElementById('view-config');
const configForm = document.getElementById('config-form');
const configHoraInicio = document.getElementById('config-horainicio');
const configHoraFim = document.getElementById('config-horafim');
let globalConfig = null;

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
    if(btnNavConfig) btnNavConfig.classList.remove('active');
    
    viewList.classList.remove('active');
    viewForm.classList.remove('active');
    viewAgenda.classList.remove('active');
    viewFinance.classList.remove('active');
    viewServicos.classList.remove('active');
    if(viewConfig) viewConfig.classList.remove('active');

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
    } else if (view === 'config') {
        if(btnNavConfig) btnNavConfig.classList.add('active');
        if(viewConfig) viewConfig.classList.add('active');
        loadConfig();
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
if(btnNavConfig) btnNavConfig.addEventListener('click', () => navigateTo('config'));
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
    await loadConfig();
    updateCalendarDateDisplay();
    renderDailyCalendar();
}

let currentDate = new Date();

function getFormattedDate(d) {
    const local = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    return local.toISOString().split('T')[0];
}

function updateCalendarDateDisplay() {
    const dateStr = getFormattedDate(currentDate);
    calendarDate.value = dateStr;
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const isToday = dateStr === getFormattedDate(new Date()) ? " (Hoje)" : "";
    calendarDayLabel.textContent = `${dayNames[currentDate.getDay()]}${isToday}`;
}

calendarDate.addEventListener('change', (e) => {
    const parts = e.target.value.split('-');
    if(parts.length === 3) {
        currentDate = new Date(parts[0], parts[1] - 1, parts[2]);
        renderDailyCalendar();
    }
});

btnPrevDay.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    renderDailyCalendar();
});

btnNextDay.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    renderDailyCalendar();
});

async function renderDailyCalendar() {
    updateCalendarDateDisplay();
    timelineContainer.innerHTML = '';
    
    // Check folga
    const dayOfWeek = currentDate.getDay().toString();
    if(globalConfig && globalConfig.diasUteis && !globalConfig.diasUteis.includes(dayOfWeek)) {
        timelineContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏖️</div>
                <h3 style="color:var(--text-primary); margin-bottom:10px;">Dia de Folga!</h3>
                <p>Nenhum atendimento previsto para este dia da semana segundo suas configurações.</p>
            </div>
        `;
        return;
    }

    const agendaAll = await window.api.getAgenda();
    const targetDate = getFormattedDate(currentDate);
    const todaysAgenda = agendaAll.filter(a => a.data === targetDate);

    let startH = parseInt(globalConfig.horaInicio.split(':')[0]);
    let endH = parseInt(globalConfig.horaFim.split(':')[0]);
    if(isNaN(startH)) startH = 8;
    if(isNaN(endH)) endH = 20;

    for(let h = startH; h <= endH; h++) {
        const hourStr = h.toString().padStart(2, '0') + ':00';
        const prefix = h.toString().padStart(2, '0') + ':';
        const appsInHour = todaysAgenda.filter(a => a.hora.startsWith(prefix));

        const slotDiv = document.createElement('div');
        slotDiv.className = 'timeline-slot';
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'timeline-time';
        timeDiv.textContent = hourStr;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content';
        
        if (appsInHour.length > 0) {
            appsInHour.forEach(agenda => {
                const client = clientsList.find(c => c.id === agenda.clienteId);
                const clientName = client ? client.nome : 'Cliente Deletada';
                const concluidoClass = agenda.concluido ? 'concluido' : '';
                
                const blockDiv = document.createElement('div');
                blockDiv.className = `agenda-block ${concluidoClass}`;
                blockDiv.innerHTML = `
                    <span style="font-weight:600;">${agenda.hora} - ${clientName} (${agenda.servico})</span>
                    <span>${parseFloat(agenda.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} ${agenda.concluido ? '✔' : ''}</span>
                `;
                blockDiv.onclick = (e) => {
                    e.stopPropagation();
                    openAgendaModal(agenda);
                };
                contentDiv.appendChild(blockDiv);
            });
        } else {
            contentDiv.style.color = '#ccc';
            contentDiv.style.fontStyle = 'italic';
            contentDiv.textContent = ''; // Removed text, just keep behavior
            const innerLink = document.createElement('span');
            innerLink.textContent = '+ Marcar Horário';
            innerLink.style.fontSize = '12px';
            innerLink.style.cursor = 'pointer';
            contentDiv.appendChild(innerLink);
            slotDiv.onclick = () => openNewAgendaModal(targetDate, hourStr);
        }

        slotDiv.appendChild(timeDiv);
        slotDiv.appendChild(contentDiv);
        timelineContainer.appendChild(slotDiv);
    }
}

function openNewAgendaModal(date, time) {
    agendaForm.reset();
    document.getElementById('agenda-id').value = '';
    agendaDataInput.value = date;
    agendaHoraInput.value = time;
    
    modalTimeLabel.textContent = `Novo Agendamento: ${time}`;
    btnDeleteAgendaModal.classList.add('hidden');
    btnConcluirAgendaModal.classList.add('hidden');
    
    agendaModalOverlay.classList.remove('hidden');
}

function openAgendaModal(agenda) {
    document.getElementById('agenda-id').value = agenda.id;
    agendaClienteSelect.value = agenda.clienteId;
    agendaServicoSelect.value = agenda.servico;
    agendaDataInput.value = agenda.data;
    agendaHoraInput.value = agenda.hora;
    document.getElementById('agenda-valor').value = agenda.valor;
    
    modalTimeLabel.textContent = `Editar Horário: ${agenda.hora}`;
    btnDeleteAgendaModal.classList.remove('hidden');
    btnDeleteAgendaModal.onclick = () => deleteAgenda(agenda.id);
    
    if(!agenda.concluido) {
        btnConcluirAgendaModal.classList.remove('hidden');
        btnConcluirAgendaModal.onclick = () => completeAgenda(agenda.id);
    } else {
        btnConcluirAgendaModal.classList.add('hidden');
    }

    agendaModalOverlay.classList.remove('hidden');
}

btnCloseAgendaModal.addEventListener('click', () => {
    agendaModalOverlay.classList.add('hidden');
});

agendaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('agenda-id').value || null;
    let concluido = false;
    
    if(id) {
       const agendaList = await window.api.getAgenda();
       const existing = agendaList.find(a => a.id === id);
       if(existing) concluido = existing.concluido;
    }
    
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
        agendaModalOverlay.classList.add('hidden');
        renderDailyCalendar(); 
    } else {
        alert("Erro ao salvar: " + response.error);
    }
});

window.deleteAgenda = async (id) => {
    if(confirm('Tem certeza que deseja apagar este agendamento?')){
        const response = await window.api.deleteAgenda(id);
        if(response.success) {
            agendaModalOverlay.classList.add('hidden');
            renderDailyCalendar();
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
        agendaModalOverlay.classList.add('hidden');
        renderDailyCalendar();
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

// ======================== CONFIGS LOGIC ========================

async function loadConfig() {
    globalConfig = await window.api.getConfig();
    if(configHoraInicio) configHoraInicio.value = globalConfig.horaInicio;
    if(configHoraFim) configHoraFim.value = globalConfig.horaFim;
    if(globalConfig.diasUteis) {
        document.querySelectorAll('input[name="diasuteis"]').forEach(cb => {
            cb.checked = globalConfig.diasUteis.includes(cb.value);
        });
    }
}

if(configForm) {
    configForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const diasUteisCheckbox = document.querySelectorAll('input[name="diasuteis"]:checked');
        const diasUteis = Array.from(diasUteisCheckbox).map(cb => cb.value);
        
        const configData = {
            horaInicio: configHoraInicio.value,
            horaFim: configHoraFim.value,
            diasUteis: diasUteis
        };

        const res = await window.api.saveConfig(configData);
        if(res.success) {
            alert('Configurações Salvas com Sucesso!');
            globalConfig = configData;
        } else {
            alert('Erro ao salvar: ' + res.error);
        }
    });
}

// Initialize
loadConfig().then(() => {
    loadClients();
    populateServicosDropdowns();
});
