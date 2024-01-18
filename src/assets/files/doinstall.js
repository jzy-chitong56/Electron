const electronService = require('app/core/services/electron.service');

function executeCommand(install) {  
  // 在这里执行你的指令或操作  
ipcRenderer.send('install-folder-noc-ROC');


  function executeFunction(param1, param2) {  
  // 在这里实现你的逻辑  
  if (typeof param1 === 'number' && typeof param2 === 'number') {  
    // 判断参数是否为数值类型  
    if (param1 > 0 && param2 > 0) {  
      // 执行正数情况下的指令  
      console.log('两个参数都是正数');  
    } else if (param1 < 0 && param2 < 0) {  
      // 执行负数情况下的指令  
      console.log('两个参数都是负数');  
    } else {  
      // 执行其他情况下的指令  
      console.log('参数值不匹配');  
    }  
  } else {  
    // 参数类型不匹配时的处理逻辑  
    console.log('参数类型不匹配');  
  }  
}

}
