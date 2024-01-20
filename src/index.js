import { ipcRenderer } from 'electron';


document.addEventListener('DOMContentLoaded', (event) => {
    const Button_ROC = document.getElementById('imageContainer.ROC');
    const Button_TFT = document.getElementById('imageContainer.TFT');
    const Button_REF = document.getElementById('imageContainer.REF');
    if (Button_ROC) {
        button.addEventListener('click', () => {
            if (Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-folder-ROC');
            } else if (Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-folder-noc-ROC');
            } else if (!Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-map-ROC');
            } else if (!Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-map-noc-ROC');
            }
        }
    )}
    if (Button_TFT) {
        button.addEventListener('click', () => {
            if (Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-folder-TFT');
            } else if (Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-folder-noc-TFT');
            } else if (!Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-map-TFT');
            } else if (!Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-map-noc-TFT');
            }
        }
    )}
    if (Button_REF) {
        button.addEventListener('click', () => {
            if (Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-folder');
            } else if (Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-folder-noc');
            } else if (!Mode_Switch_State && BJ_Switch_State) {
                ipcRenderer.send('install-map');
            } else if (!Mode_Switch_State && !BJ_Switch_State) {
                ipcRenderer.send('install-map-noc');
            }
        }
        )}
});
