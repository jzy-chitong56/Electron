var { Injectable } = require('@angular/core');
const { ElectronService } = ('src/app/core/services/electron/electron.service');

var ElectronService = (function() {
  function ElectronService() {
  }
  return ElectronService;
})();

ElectronService.ɵprov = { 
  token: ElectronService, 
  providedIn: 'root',
};
class ElectronService {  
  constructor(electronService) {  
    this.electronService = ElectronService;  
  }  
}

image_Container_ROC.addEventListener('click', () => {
    if (Mode_Switch_State && BJ_Switch_State) {
        ElectronService.ipcRenderer.send('install-folder-ROC')
    } else if (Mode_Switch_State && !BJ_Switch_State) {
        ElectronService.ipcRenderer.send('install-folder-noc-ROC')
    } else if (!Mode_Switch_State && BJ_Switch_State) {
        ElectronService.ipcRenderer.send('install-map-ROC')
    } else if (!Mode_Switch_State && !BJ_Switch_State) {
        ElectronService.ipcRenderer.send('install-map-noc-ROC')
    }
})


image_Container_TFT.addEventListener('click', () => {
    if (Mode_Switch_State && BJ_Switch_State) {
        ipcRenderer.send('install-folder-TFT')
    } else if (Mode_Switch_State && !BJ_Switch_State) {
        ipcRenderer.send('install-folder-noc-TFT')
    } else if (!Mode_Switch_State && BJ_Switch_State) {
        ipcRenderer.send('install-map-TFT')
    } else if (!Mode_Switch_State && !BJ_Switch_State) {
        ipcRenderer.send('install-map-noc-TFT')
    }
})

image_Container_REF.addEventListener('click', () => {
    if (Mode_Switch_State && BJ_Switch_State) {
        this.electronService.ipcRenderer.send('install-folder')
    } else if (Mode_Switch_State && !BJ_Switch_State) {
        this.electronService.ipcRenderer.send('install-folder-noc')
    } else if (!Mode_Switch_State && BJ_Switch_State) {
        this.electronService.ipcRenderer.send('install-map')
    } else if (!Mode_Switch_State && !BJ_Switch_State) {
        this.electronService.ipcRenderer.send('install-map-noc')
    }
})
