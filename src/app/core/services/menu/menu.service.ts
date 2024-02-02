import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class MenuService {
  public template: any = [
   {
      label: this.translate.getTranslation('PAGES.MUSE.FULLSCREEN'),
      role: 'togglefullscreen',
    },
   {
      label: this.translate.getTranslation('PAGES.MUSE.DEV_TOOL'),
      role: 'toggleDevTools',
    },
  ];

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

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    ) { }
  
}
