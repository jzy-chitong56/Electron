const electronService = require('app/core/services/electron.service');

function executeCommand(install) {  
  // 在这里执行你的指令或操作  
ipcRenderer.send('install-folder-noc-ROC');

}
