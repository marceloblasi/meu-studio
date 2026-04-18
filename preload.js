const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getClients: () => ipcRenderer.invoke('get-clients'),
    saveClient: (clientData) => ipcRenderer.invoke('save-client', clientData),
    deleteClient: (clientId) => ipcRenderer.invoke('delete-client', clientId),
    getAgenda: () => ipcRenderer.invoke('get-agenda'),
    saveAgenda: (agendaData) => ipcRenderer.invoke('save-agenda', agendaData),
    deleteAgenda: (agendaId) => ipcRenderer.invoke('delete-agenda', agendaId)
});
