const electronService = require('app/core/services/electron.service');

export function myFunction(mode, bj, ver) {  
// 在这里实现你的逻辑  

  if (bj == false) {  
    if (mode == 0) { 
      if (ver == 0) {
        ipcRenderer.send('install-folder-noc-ROC');
      } else if (ver == 2) {
        ipcRenderer.send('install-folder-noc-TFT');
      } else if (ver == 3) {
        ipcRenderer.send('install-folder-noc');
      }
    } else if (mode == 1) {
      if (ver == 1) {
        ipcRenderer.send('install-map-noc-ROC');
      } else if (ver == 2) {
        ipcRenderer.send('install-map-noc-TFT');
      } else if (ver == 3) {
        ipcRenderer.send('install-map-noc');
      }
    }
  } else if (bj == true) { 
    if (mode == 0) { 
      if (ver == 1) {
        ipcRenderer.send('install-folder-ROC');
      } else if (ver == 2) {
        ipcRenderer.send('install-folder-TFT');
      } else if (ver == 3) {
        ipcRenderer.send('install-folder');
      }
    } else if (mode == 1) { 
      if (ver == 1) {
        ipcRenderer.send('install-map-ROC');
      } else if (ver == 2) {
        ipcRenderer.send('install-map-TFT');
      } else if (ver == 3) {
        ipcRenderer.send('install-map-noc');
      }
    }
  }  
} 
