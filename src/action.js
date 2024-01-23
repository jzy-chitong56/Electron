const { ipcRenderer } = require('electron');


class ElectronService {
  constructor() {}
  sendInstallationMessage(ver) {
    let modeState = mode ? '-folder' : '-map';
    let bjState = com ? '' : '-noc';
    const message = `install${modeState}${bjState}${ver}`;
    ipcRenderer.send(message);
  }
}

module.exports = new ElectronService();

function inallstAction(ver, mode, com) {
       ElectronService.sendInstallationMessage(-ver, mode, com);
}


// image_Container_ROC.addEventListener('click', () => {
//     let modeState = Mode_Switch_State ? '-folder' : '-map';
//     let bjState = BJ_Switch_State ? '' : '-noc';
//     ElectronService.ipcRenderer.send('install${modeState}${bjState}-ROC');
// });

// image_Container_TFT.addEventListener('click', () => {
//     let modeState = Mode_Switch_State ? '-folder' : '-map';
//     let bjState = BJ_Switch_State ? '' : '-noc';
//     ipcRenderer.send('install${modeState}${bjState}-TFT');
// });

// image_Container_REF.addEventListener('click', () => {
//     let modeState = Mode_Switch_State ? '-folder' : '-map';
//     let bjState = BJ_Switch_State ? '' : '-noc';
//     this.electronService.ipcRenderer.send('install${modeState}${bjState}');
// });
