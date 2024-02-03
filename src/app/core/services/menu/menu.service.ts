import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class MenuService {
  public template: any = [
   {
      label: 'A',
      role: 'toggleDevTools',
    },
   {
      label: '',
      role: 'togglefullscreen',
    },
   {
      label: '',
      role: 'toggleDevTools',
    },
  ];

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    ) { }

  public createMenu() {
    if(this.electronService.isElectron) {
      let fullscreenLabel = this.translate.get('PAGES.MUSE.FULLSCREEN'); 
      let devToolLabel = this.translate.get('PAGES.MUSE.DEV_TOOL'); 
      const { Menu } = this.electronService;
      console.log("Menu 1", fullscreenLabel);
      console.log("Menu 2", devToolLabel);
      this.template[1].label = fullscreenLabel;  
      this.template[2].label = devToolLabel;  
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
