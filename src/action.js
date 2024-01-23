const { ipcRenderer } = require('electron');

function installAction(ver, Mode_Switch_State, BJ_Switch_State) {
  let modeState = Mode_Switch_State ? '-folder' : '-map';
  let bjState = BJ_Switch_State ? '' : '-noc';
  window.electron.ipcRenderer.send('install${modeState}${bjState}ver');
  //     this.electronService.ipcRenderer.send('install${modeState}${bjState}ver');
  //     ElectronService.ipcRenderer.send('install${modeState}${bjState}ver');
}


// class ElectronService {
//   constructor() {}
//   sendInstallationMessage(ver, mode, com) {
//     let modeState = mode ? '-folder' : '-map';
//     let bjState = com ? '' : '-noc';
//     const message = `install${modeState}${bjState}ver`;
//     ipcRenderer.send(message);
//   }
// }

// module.exports = new ElectronService();
