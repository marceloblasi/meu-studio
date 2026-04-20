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

// Home Elements
const btnNavHome = document.getElementById('btn-nav-home');
const viewHome = document.getElementById('view-home');
const homeBtnAgenda = document.getElementById('home-btn-agenda');
const homeBtnFinance = document.getElementById('home-btn-finance');
const homeBtnList = document.getElementById('home-btn-list');
const homeBtnServicos = document.getElementById('home-btn-servicos');

const btnPageAdd = document.getElementById('btn-page-add');
const btnPageConfig = document.getElementById('btn-page-config');

// Agenda Elements
const btnNavAgenda = document.getElementById('btn-nav-agenda');
const viewAgenda = document.getElementById('view-agenda');

const calendarDate = document.getElementById('calendar-date');
const calendarDayLabel = document.getElementById('calendar-day-label');
const btnPrevDay = document.getElementById('btn-prev-day');
const btnNextDay = document.getElementById('btn-next-day');
const timelineContainer = document.getElementById('timeline-container');

const btnToggleAgendaView = document.getElementById('btn-toggle-agenda-view');
const agendaListViewContainer = document.getElementById('agenda-list-view-container');
const agendaListTbody = document.getElementById('agenda-list-tbody');
const agendaListEmpty = document.getElementById('agenda-list-empty');
let agendaViewMode = 'calendar';

const agendaModalOverlay = document.getElementById('agenda-modal-overlay');
const agendaForm = document.getElementById('agenda-form');
const agendaClienteSelect = document.getElementById('agenda-cliente');
const agendaServicoSelect = document.getElementById('agenda-servico');
const agendaValorInput = document.getElementById('agenda-valor');
const agendaDataInput = document.getElementById('agenda-data');
const agendaHoraInput = document.getElementById('agenda-hora');
const agendaHoraFimInput = document.getElementById('agenda-hora-fim');

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
    if(btnNavHome) btnNavHome.classList.remove('active');
    btnNavList.classList.remove('active');
    btnNavAdd.classList.remove('active');
    btnNavAgenda.classList.remove('active');
    btnNavFinance.classList.remove('active');
    btnNavServicos.classList.remove('active');
    if(btnNavConfig) btnNavConfig.classList.remove('active');
    
    if(viewHome) viewHome.classList.remove('active');
    viewList.classList.remove('active');
    viewForm.classList.remove('active');
    viewAgenda.classList.remove('active');
    viewFinance.classList.remove('active');
    viewServicos.classList.remove('active');
    if(viewConfig) viewConfig.classList.remove('active');

    if (view === 'home') {
        if(btnNavHome) btnNavHome.classList.add('active');
        if(viewHome) viewHome.classList.add('active');
    } else if (view === 'list') {
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
if(btnNavHome) btnNavHome.addEventListener('click', () => navigateTo('home'));
btnNavList.addEventListener('click', () => navigateTo('list'));
btnNavAgenda.addEventListener('click', () => navigateTo('agenda'));
btnNavFinance.addEventListener('click', () => navigateTo('finance'));
btnNavServicos.addEventListener('click', () => navigateTo('servicos'));

// Home Cards
if(homeBtnAgenda) homeBtnAgenda.addEventListener('click', () => navigateTo('agenda'));
if(homeBtnFinance) homeBtnFinance.addEventListener('click', () => navigateTo('finance'));
if(homeBtnList) homeBtnList.addEventListener('click', () => navigateTo('list'));
if(homeBtnServicos) homeBtnServicos.addEventListener('click', () => navigateTo('servicos'));

// Substitutes
if(btnPageAdd) btnPageAdd.addEventListener('click', openAddForm);
if(btnPageConfig) btnPageConfig.addEventListener('click', () => navigateTo('config'));

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
    timelineContainer.className = 'calendar-grid'; 
    timelineContainer.innerHTML = '';
    
    // Check folga
    const dayOfWeek = currentDate.getDay().toString();
    if(globalConfig && globalConfig.diasUteis && !globalConfig.diasUteis.includes(dayOfWeek)) {
        timelineContainer.style.display = 'block';
        if(agendaListViewContainer) agendaListViewContainer.style.display = 'none';
        timelineContainer.innerHTML = `
            <div class="empty-state" style="margin-top:40px;">
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

    if (agendaViewMode === 'list') {
        timelineContainer.style.display = 'none';
        if(agendaListViewContainer) agendaListViewContainer.style.display = 'block';
        renderAgendaListView(todaysAgenda);
        return;
    } else {
        timelineContainer.style.display = 'block';
        if(agendaListViewContainer) agendaListViewContainer.style.display = 'none';
    }

    let startH = parseInt(globalConfig.horaInicio.split(':')[0]);
    let endH = parseInt(globalConfig.horaFim.split(':')[0]);
    if(isNaN(startH)) startH = 8;
    if(isNaN(endH)) endH = 20;

    const totalHours = endH - startH + 1;
    
    const inner = document.createElement('div');
    inner.className = 'calendar-inner';
    inner.style.height = `${totalHours * 60}px`;

    for(let h = startH; h <= endH; h++) {
        const rowTop = (h - startH) * 60;
        
        const timeRow = document.createElement('div');
        timeRow.className = 'time-row';
        timeRow.style.top = `${rowTop}px`;
        
        const labelCol = document.createElement('div');
        labelCol.className = 'time-label-col';
        labelCol.textContent = h.toString().padStart(2, '0') + ':00';
        timeRow.appendChild(labelCol);
        
        inner.appendChild(timeRow);

        const slot1 = document.createElement('div');
        slot1.className = 'bg-slot';
        slot1.style.top = `${rowTop}px`;
        slot1.onclick = () => openNewAgendaModal(targetDate, h.toString().padStart(2, '0') + ':00', h.toString().padStart(2, '0') + ':30');
        inner.appendChild(slot1);

        if(h < endH) {
            const timeRowHalf = document.createElement('div');
            timeRowHalf.className = 'time-row-half';
            timeRowHalf.style.top = `${rowTop + 30}px`;
            inner.appendChild(timeRowHalf);
            
            const slot2 = document.createElement('div');
            slot2.className = 'bg-slot';
            slot2.style.top = `${rowTop + 30}px`;
            slot2.onclick = () => openNewAgendaModal(targetDate, h.toString().padStart(2, '0') + ':30', (h+1).toString().padStart(2, '0') + ':00');
            inner.appendChild(slot2);
        }
    }

    todaysAgenda.forEach(agenda => {
        const client = clientsList.find(c => c.id === agenda.clienteId);
        const clientName = client ? client.nome : 'Cliente Deletada';
        
        const eventStartSplit = agenda.hora.split(':');
        let eh = parseInt(eventStartSplit[0]);
        let em = parseInt(eventStartSplit[1]);
        if(isNaN(eh)) eh = startH;
        if(isNaN(em)) em = 0;
        
        let fh = eh + 1;
        let fm = em;
        if (agenda.horaFim) {
            const endSplit = agenda.horaFim.split(':');
            fh = parseInt(endSplit[0]);
            fm = parseInt(endSplit[1]);
        }
        
        let startMinutes = (eh - startH) * 60 + em;
        let endMinutes = (fh - startH) * 60 + fm;
        let durationMinutes = endMinutes - startMinutes;
        
        if (durationMinutes < 15) durationMinutes = 15;
        if (startMinutes < 0) startMinutes = 0;
        
        const topPx = startMinutes;
        const heightPx = durationMinutes;

        const blockDiv = document.createElement('div');
        blockDiv.className = `calendar-event ${agenda.concluido ? 'concluido' : ''}`;
        blockDiv.style.top = `${topPx}px`;
        blockDiv.style.height = `${heightPx}px`;
        
        const hFimStr = fh.toString().padStart(2,'0') + ':' + fm.toString().padStart(2,'0');

        blockDiv.innerHTML = `
            <div class="calendar-event-time">${agenda.hora} - ${hFimStr} ${agenda.concluido ? '✔' : ''}</div>
            <div style="font-weight:600; font-size:13px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${clientName}</div>
            <div style="font-size:11px; margin-top:auto;">${agenda.servico}</div>
        `;
        blockDiv.onclick = (e) => {
            e.stopPropagation();
            openAgendaModal(agenda);
        };
        inner.appendChild(blockDiv);
    });

    if (targetDate === getFormattedDate(new Date())) {
        const now = new Date();
        let nh = now.getHours();
        let nm = now.getMinutes();
        if (nh >= startH && nh <= endH) {
            const nowPx = (nh - startH) * 60 + nm;
            const line = document.createElement('div');
            line.className = 'current-time-line';
            line.style.top = `${nowPx}px`;
            const dot = document.createElement('div');
            dot.className = 'current-time-dot';
            dot.style.top = `${nowPx}px`;
            inner.appendChild(line);
            inner.appendChild(dot);
            
            setTimeout(() => {
                timelineContainer.scrollTop = nowPx - 100 > 0 ? nowPx - 100 : 0;
            }, 100);
        }
    }

    timelineContainer.appendChild(inner);
}

function renderAgendaListView(agendaList) {
    if(!agendaListTbody) return;
    agendaListTbody.innerHTML = '';
    
    if (agendaList.length === 0) {
        agendaListEmpty.classList.remove('hidden');
        return;
    }
    
    agendaListEmpty.classList.add('hidden');
    
    agendaList.forEach(agenda => {
        const client = clientsList.find(c => c.id === agenda.clienteId);
        const clientName = client ? client.nome : 'Cliente Deletada';
        
        let fhStr = '';
        if(agenda.horaFim) {
             fhStr = ` - ${agenda.horaFim}`;
        }

        const dataBr = agenda.data.split('-').reverse().join('/');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataBr}</td>
            <td><strong>${agenda.hora}${fhStr}</strong></td>
            <td>${clientName}</td>
            <td>${agenda.servico}</td>
            <td>
                ${agenda.concluido ? '<span class="badge-concluido">✔ Concluído</span>' : '<span style="color:#FFA4B2; font-size:12px;">Agendado</span>'}
            </td>
        `;
        tr.onclick = () => openAgendaModal(agenda);
        tr.style.cursor = 'pointer';
        agendaListTbody.appendChild(tr);
    });
}

if(btnToggleAgendaView) {
    btnToggleAgendaView.addEventListener('click', () => {
        if(agendaViewMode === 'calendar') {
            agendaViewMode = 'list';
            btnToggleAgendaView.textContent = 'Ver Calendário Mágico ✨';
        } else {
            agendaViewMode = 'calendar';
            btnToggleAgendaView.textContent = 'Ver Horários em Lista 📋';
        }
        renderDailyCalendar();
    });
}

function openNewAgendaModal(date, timeStart, timeEnd) {
    agendaForm.reset();
    document.getElementById('agenda-id').value = '';
    agendaDataInput.value = date;
    agendaHoraInput.value = timeStart;
    if(agendaHoraFimInput) agendaHoraFimInput.value = timeEnd;
    
    modalTimeLabel.textContent = `Novo Agendamento: ${timeStart} às ${timeEnd}`;
    btnDeleteAgendaModal.classList.add('hidden');
    btnConcluirAgendaModal.classList.add('hidden');
    
    agendaModalOverlay.style.display = 'flex';
}

function openAgendaModal(agenda) {
    document.getElementById('agenda-id').value = agenda.id;
    agendaClienteSelect.value = agenda.clienteId;
    agendaServicoSelect.value = agenda.servico;
    agendaDataInput.value = agenda.data;
    agendaHoraInput.value = agenda.hora;
    document.getElementById('agenda-valor').value = agenda.valor;
    
    if(agendaHoraFimInput) {
        let hFim = agenda.horaFim;
        if(!hFim) {
            const split = agenda.hora.split(':');
            hFim = (parseInt(split[0]) + 1).toString().padStart(2,'0') + ':' + split[1];
        }
        agendaHoraFimInput.value = hFim;
        modalTimeLabel.textContent = `Editar Horário: ${agenda.hora} às ${hFim}`;
    } else {
        modalTimeLabel.textContent = `Editar Horário: ${agenda.hora}`;
    }

    btnDeleteAgendaModal.classList.remove('hidden');
    btnDeleteAgendaModal.onclick = () => deleteAgenda(agenda.id);
    
    if(!agenda.concluido) {
        btnConcluirAgendaModal.classList.remove('hidden');
        btnConcluirAgendaModal.onclick = () => completeAgenda(agenda.id);
    } else {
        btnConcluirAgendaModal.classList.add('hidden');
    }

    agendaModalOverlay.style.display = 'flex';
}

btnCloseAgendaModal.addEventListener('click', () => {
    agendaModalOverlay.style.display = 'none';
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
        horaFim: agendaHoraFimInput ? agendaHoraFimInput.value : null,
        valor: document.getElementById('agenda-valor').value,
        concluido: concluido
    };

    const response = await window.api.saveAgenda(agendaData);
    if (response.success) {
        agendaModalOverlay.style.display = 'none';
        renderDailyCalendar(); 
    } else {
        alert("Erro ao salvar: " + response.error);
    }
});

window.deleteAgenda = async (id) => {
    if(confirm('Tem certeza que deseja apagar este agendamento?')){
        const response = await window.api.deleteAgenda(id);
        if(response.success) {
            agendaModalOverlay.style.display = 'none';
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
        agendaModalOverlay.style.display = 'none';
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
