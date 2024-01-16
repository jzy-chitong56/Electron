import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public template: any = [
    {
      label: '安装',
      submenu: [
        {
          label: '安装重制版冰封王座到指定文件夹',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder');
          }
        },
        {
          label: '安装重制版冰封王座到指定文件夹(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder-noc');
          }
        },
        {
          label: '安装重制版冰封王座到指定地图',
          click: () => {
            this.electronService.ipcRenderer.send('install-map');
          }
        },
        {
          label: '安装重制版冰封王座到指定地图(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-map-noc');
          }
        },
        {
          label: '安装经典版冰封王座到指定文件夹',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder-TFT');
          }
        },
        {
          label: '安装经典版冰封王座到指定文件夹(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder-noc-TFT');
          }
        },
        {
          label: '安装经典版冰封王座到指定地图',
          click: () => {
            this.electronService.ipcRenderer.send('install-map-TFT');
          }
        },
        {
          label: '安装经典版冰封王座到指定地图(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-map-noc-TFT');
          }
        },
                {
          label: '安装经典版混乱之治到指定文件夹',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder-ROC');
          }
        },
        {
          label: '安装经典版混乱之治到指定文件夹(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-folder-noc-ROC');
          }
        },
        {
          label: '安装经典版混乱之治到指定地图',
          click: () => {
            this.electronService.ipcRenderer.send('install-map-ROC');
          }
        },
        {
          label: '安装经典版混乱之治到指定地图(不装控制台)',
          click: () => {
            this.electronService.ipcRenderer.send('install-map-noc-ROC');
          }
        }
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
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: '重载壁纸' },
        { role: '强制重载壁纸' },
        { role: '打开浏览器控制台' },
        { type: 'separator' },
        { role: '还原壁纸尺寸' },
        { role: '缩小壁纸' },
        { role: '放大壁纸' },
        { type: 'separator' },
        { role: '全屏' }
      ]
    },
  ]

  constructor(
    private electronService: ElectronService
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
