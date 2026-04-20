const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const dataFilePath = path.join(app.getPath('userData'), 'clientes_allanda.json');
const agendaFilePath = path.join(app.getPath('userData'), 'agenda_allanda.json');
const servicosFilePath = path.join(app.getPath('userData'), 'servicos_allanda.json');
const configFilePath = path.join(app.getPath('userData'), 'config_allanda.json');

// Inicializa o arquivo se não existir
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}
if (!fs.existsSync(agendaFilePath)) {
    fs.writeFileSync(agendaFilePath, JSON.stringify([]));
}
if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, JSON.stringify({
        horaInicio: "08:00",
        horaFim: "20:00",
        diasUteis: ["1", "2", "3", "4", "5", "6"] // Seg a Sábado
    }, null, 2));
}
if (!fs.existsSync(servicosFilePath)) {
    fs.writeFileSync(servicosFilePath, JSON.stringify([
        { id: "1", nome: "Sobrancelha", valor: "50" },
        { id: "2", nome: "Massagem", valor: "120" },
        { id: "3", nome: "Unhas", valor: "60" }
    ]));
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        backgroundColor: '#FFF5F8' // Rosa claro
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    const menu = Menu.buildFromTemplate([
        {
            label: 'Início',
            click: () => {
                const wins = BrowserWindow.getAllWindows();
                if(wins.length > 0) wins[0].webContents.executeJavaScript('if(typeof navigateTo === "function") navigateTo("home");');
            }
        }
    ]);
    Menu.setApplicationMenu(menu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handler para obter clientes
ipcMain.handle('get-clients', () => {
    try {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Erro ao ler clientes", error);
        return [];
    }
});

// IPC Handler para salvar (novo ou atualizar) cliente
ipcMain.handle('save-client', (event, clientData) => {
    try {
        const rawData = fs.readFileSync(dataFilePath);
        let clients = JSON.parse(rawData);

        if (clientData.id) {
            // Atualizar existente
            const index = clients.findIndex(c => c.id === clientData.id);
            if (index !== -1) {
                clients[index] = clientData;
            }
        } else {
            // Criar novo
            clientData.id = Date.now().toString(); // ID único simples
            clients.push(clientData);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(clients, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar cliente", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para excluir cliente
ipcMain.handle('delete-client', (event, clientId) => {
    try {
        const rawData = fs.readFileSync(dataFilePath);
        let clients = JSON.parse(rawData);
        
        clients = clients.filter(c => c.id !== clientId);
        
        fs.writeFileSync(dataFilePath, JSON.stringify(clients, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar cliente", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para obter agenda
ipcMain.handle('get-agenda', () => {
    try {
        const rawData = fs.readFileSync(agendaFilePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Erro ao ler agenda", error);
        return [];
    }
});

// IPC Handler para salvar (novo ou atualizar) agendamento
ipcMain.handle('save-agenda', (event, agendaData) => {
    try {
        const rawData = fs.readFileSync(agendaFilePath);
        let agenda = JSON.parse(rawData);

        if (agendaData.id) {
            const index = agenda.findIndex(c => c.id === agendaData.id);
            if (index !== -1) {
                agenda[index] = agendaData;
            }
        } else {
            agendaData.id = Date.now().toString();
            agenda.push(agendaData);
        }

        // Ordenar por data
        agenda.sort((a, b) => {
            const dateA = new Date(a.data + 'T' + a.hora);
            const dateB = new Date(b.data + 'T' + b.hora);
            return dateA - dateB;
        });

        fs.writeFileSync(agendaFilePath, JSON.stringify(agenda, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar agenda", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para excluir agendamento
ipcMain.handle('delete-agenda', (event, agendaId) => {
    try {
        const rawData = fs.readFileSync(agendaFilePath);
        let agenda = JSON.parse(rawData);
        
        agenda = agenda.filter(c => c.id !== agendaId);
        
        fs.writeFileSync(agendaFilePath, JSON.stringify(agenda, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar agenda", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para obter serviços
ipcMain.handle('get-servicos', () => {
    try {
        const rawData = fs.readFileSync(servicosFilePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Erro ao ler servicos", error);
        return [];
    }
});

// IPC Handler para salvar serviço
ipcMain.handle('save-servico', (event, servicoData) => {
    try {
        const rawData = fs.readFileSync(servicosFilePath);
        let servicos = JSON.parse(rawData);

        if (servicoData.id) {
            const index = servicos.findIndex(c => c.id === servicoData.id);
            if (index !== -1) {
                servicos[index] = servicoData;
            }
        } else {
            servicoData.id = Date.now().toString();
            servicos.push(servicoData);
        }

        fs.writeFileSync(servicosFilePath, JSON.stringify(servicos, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar servico", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para excluir serviço
ipcMain.handle('delete-servico', (event, servicoId) => {
    try {
        const rawData = fs.readFileSync(servicosFilePath);
        let servicos = JSON.parse(rawData);
        
        servicos = servicos.filter(c => c.id !== servicoId);
        
        fs.writeFileSync(servicosFilePath, JSON.stringify(servicos, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar servico", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler para config
ipcMain.handle('get-config', () => {
    try {
        const rawData = fs.readFileSync(configFilePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Erro ao ler config", error);
        return {};
    }
});

ipcMain.handle('save-config', (event, configData) => {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2));
        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar config", error);
        return { success: false, error: error.message };
    }
});
