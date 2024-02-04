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
      this.translate.get('PAGES.MUSE.FULLSCREEN').subscribe((res) => {
        this.template[1].label = res;
        console.log("Menu 1", res);
      }); 
      // this.translate.get('PAGES.MUSE.DEV_TOOL').subscribe((res) => {
      //   this.template[2].label = res;
      //   console.log("Menu 2", res);
      // }); 
      this.template[2].label =this.translate.instant('PAGES.MUSE.DEV_TOOL')
      console.log("Menu 2", res);
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
