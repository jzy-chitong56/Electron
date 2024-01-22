const { ipcRenderer } = require('src/app/core/services/electron/electron.service');
const modeState = Mode_Switch_State ? '-folder' : '-map';
const bjState = BJ_Switch_State ? '' : '-noc';

image_Container_ROC.addEventListener('click', () => {
    ElectronService.ipcRenderer.send('install${modeState}${bjState}-ROC');
});

image_Container_TFT.addEventListener('click', () => {
    ipcRenderer.send('install${modeState}${bjState}-TFT');
});

image_Container_REF.addEventListener('click', () => {
    this.electronService.ipcRenderer.send('install${modeState}${bjState}');
});
