import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class MenuService {
  public template: any = [
    //{
      // label: '安装',
      // submenu: [
      //   {
      //     label: '安装重制版冰封王座到指定文件夹',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder');
      //     }
      //   },
      //   {
      //     label: '安装重制版冰封王座到指定文件夹(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder-noc');
      //     }
      //   },
      //   {
      //     label: '安装重制版冰封王座到指定地图',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map');
      //     }
      //   },
      //   {
      //     label: '安装重制版冰封王座到指定地图(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map-noc');
      //     }
      //   },
      //   {
      //     label: '安装经典版冰封王座到指定文件夹',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder-TFT');
      //     }
      //   },
      //   {
      //     label: '安装经典版冰封王座到指定文件夹(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder-noc-TFT');
      //     }
      //   },
      //   {
      //     label: '安装经典版冰封王座到指定地图',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map-TFT');
      //     }
      //   },
      //   {
      //     label: '安装经典版冰封王座到指定地图(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map-noc-TFT');
      //     }
      //   },
      //           {
      //     label: '安装经典版混乱之治到指定文件夹',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder-ROC');
      //     }
      //   },
      //   {
      //     label: '安装经典版混乱之治到指定文件夹(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-folder-noc-ROC');
      //     }
      //   },
      //   {
      //     label: '安装经典版混乱之治到指定地图',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map-ROC');
      //     }
      //   },
      //   {
      //     label: '安装经典版混乱之治到指定地图(不装控制台)',
      //     click: () => {
      //       this.electronService.ipcRenderer.send('install-map-noc-ROC');
      //     }
      //  }
        // TODO: recreate MakeTFT script
        // FIXME: convert MakeTFTBase.bat to JS script
        // FIXME: convert MakeTFT.bat to JS script
        // FIXME: convert ejass.pl to JS script
        //{
        //  label: 'Compile',
        //  click: () => {
        //    this.electronService.ipcRenderer.send('compile');
        //  }
        // },
        // TODO: recreate MakeOptTFT.bat script
        // { label: 'Compile, Optimize' },
        // TODO: recreate MakeVAITFT.bat script
        // { label: 'Compile AMAI vs Default AI' },
      //]
    //},
    // {
    //   label: '查看',
    //   submenu: [
    //     { role: 'reload' },
    //     { role: 'forceReload' },
    //     { role: 'toggleDevTools' },
    //     { type: 'separator' },
    //     { role: 'resetZoom' },
    //     { role: 'zoomIn' },
    //     { role: 'zoomOut' },
    //     { type: 'separator' },
    //     { role: 'togglefullscreen' }
    //   ]
    // },
    {  
      label: {{ 'PAGES.MUSE.FULLSCREEN' | translate }}',  
      role: 'togglefullscreen'  
    },
    {
      label: {{ 'PAGES.MUSE.DEV_TOOL' | translate }}',  
      role: 'toggleDevTools'  
    },
  ]

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    ) { }

  public createMenu() {
    if(this.electronService.isElectron) {
      const { Menu } = this.electronService;
      const menu = Menu.buildFromTemplate(this.template);
      Menu.setApplicationMenu(menu);
    }
  }

  public changeEnabledMenuState(state: boolean) {
    if(this.electronService.isElectron) {
      const { Menu } = this.electronService;
      const { items } = Menu.getApplicationMenu();

      items?.forEach(item => {
        item?.submenu?.items?.forEach(sub => sub.enabled = state);
      });
    }
  }
}
