const { ipcRenderer } = require('electron');
//window.electron = require('electron');

 
    var Mode_Switch = document.getElementById('ModeSwitch');
    var BJ_Switch = document.getElementById('BJSwitch');
    var Mode_Switch_State = true;
    var BJ_Switch_State = true;
    var Images_ROC_Enable = document.getElementById('ImagesROCEnable');
    var Images_ROC_Disable = document.getElementById('ImagesROCDisable');
    var image_Container_ROC = document.getElementById('imageContainerROC');
    var ROCShown = false;
    var Images_TFT_Enable = document.getElementById('ImagesTFTEnable');
    var Images_TFT_Disable = document.getElementById('ImagesTFTDisable');
    var image_Container_TFT = document.getElementById('imageContainerTFT');
    var TFTShown = false;
    var Images_REF_Enable = document.getElementById('ImagesREFEnable');
    var Images_REF_Disable = document.getElementById('ImagesREFDisable');
    var image_Container_REF = document.getElementById('imageContainerREF');
    var REFShown = false;
    var image_test = document.getElementById('testico');
    

    // 为图片容器添加鼠标悬停和点击事件监听器
    image_Container_ROC.addEventListener('mouseover', function() {
      if (!ROCShown) {
      Images_ROC_Enable.style.display = 'block';
      Images_ROC_Disable.style.display = 'none';
      }
    });
    image_Container_ROC.addEventListener('mouseout', function() {
      if (!ROCShown) {
      Images_ROC_Enable.style.display = 'none';
      Images_ROC_Disable.style.display = 'block';
      }
    });

    image_Container_ROC.addEventListener('click', function() {
      // 点击时切换图片显示
      if (!ROCShown) {
        Images_ROC_Enable.style.display = 'block';
        Images_ROC_Disable.style.display = 'none';
        Images_TFT_Enable.style.display = 'none';
        Images_TFT_Disable.style.display = 'block';
        Images_REF_Enable.style.display = 'none';
        Images_REF_Disable.style.display = 'block';
        TFTShown = false
        REFShown = false
        installAction('-ROC', Mode_Switch_State, BJ_Switch_State); 
      } else {
        Images_ROC_Enable.style.display = 'none';
        Images_ROC_Disable.style.display = 'block';
      }
      ROCShown = !ROCShown;
    });

    // 为图片容器添加鼠标悬停和点击事件监听器
    image_Container_TFT.addEventListener('mouseover', function() {
      if (!TFTShown) {
      Images_TFT_Enable.style.display = 'block';
      Images_TFT_Disable.style.display = 'none';
      }
    });
    
    image_Container_TFT.addEventListener('mouseout', function() {
      if (!TFTShown) {
      Images_TFT_Enable.style.display = 'none';
      Images_TFT_Disable.style.display = 'block';
      }
    });

    image_Container_TFT.addEventListener('click', function() {
      // 点击时切换图片显示
      if (!TFTShown) {
        Images_TFT_Enable.style.display = 'block';
        Images_TFT_Disable.style.display = 'none';
        Images_ROC_Enable.style.display = 'none';
        Images_ROC_Disable.style.display = 'block';
        Images_REF_Enable.style.display = 'none';
        Images_REF_Disable.style.display = 'block';
        ROCShown = false
        REFShown = false
        installAction('-TFT', Mode_Switch_State, BJ_Switch_State); 
      } else {
        Images_TFT_Enable.style.display = 'none';
        Images_TFT_Disable.style.display = 'block';
      }
      TFTShown = !TFTShown;
    });

    // 为图片容器添加鼠标悬停和点击事件监听器
    image_Container_REF.addEventListener('mouseover', function() {
      if (!REFShown) {
      Images_REF_Enable.style.display = 'block';
      Images_REF_Disable.style.display = 'none';
      }
    });

    image_Container_REF.addEventListener('mouseout', function() {
      if (!REFShown) {
      Images_REF_Enable.style.display = 'none';
      Images_REF_Disable.style.display = 'block';
      }
    });

    image_Container_REF.addEventListener('click', function() {
      // 点击时切换图片显示
      if (!REFShown) {
        Images_REF_Enable.style.display = 'block';
        Images_REF_Disable.style.display = 'none';
        Images_ROC_Enable.style.display = 'none';
        Images_ROC_Disable.style.display = 'block';
        Images_TFT_Enable.style.display = 'none';
        Images_TFT_Disable.style.display = 'block';
        ROCShown = false
        TFTShown = false
        installAction('-REF', Mode_Switch_State, BJ_Switch_State); 
      } else {
        Images_REF_Enable.style.display = 'none';
        Images_REF_Disable.style.display = 'block';
      }
      REFShown = !REFShown;
    });

    Mode_Switch.addEventListener('click', function() {
      Mode_Switch_State = !Mode_Switch_State; 
    });
    BJ_Switch.addEventListener('click', function() {
      BJ_Switch_State = !BJ_Switch_State; 
    });




function installAction(ver, Mode_Switch_State, BJ_Switch_State) {
  let modeState = Mode_Switch_State ? '-folder' : '-map';
  let bjState = BJ_Switch_State ? '' : '-noc';
  ipcRenderer.send('install${modeState}${bjState}ver');
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
