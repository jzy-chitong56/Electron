import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class MenuService {
  public template: any[] = [];

  private readonly menuStructure = [
    { role: 'togglefullscreen' },
    { role: 'toggleDevTools' }
  ];

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    ) { }

  public createMenu() {
    if(this.electronService.isElectron) {
      const { Menu } = this.electronService;
      this.translate.get([
        'PAGES.MUSE.FULLSCREEN',
        'PAGES.MUSE.DEV_TOOL'
      ]).subscribe(translations => {
        const { Menu } = this.electronService;
        const { items } = Menu.getApplicationMenu();
        items?.forEach(item => {
          item?.submenu?.items?.forEach(sub =>
            sub.role === 'togglefullscreen' ? translations['PAGES.MUSE.FULLSCREEN'] : translations['PAGES.MUSE.DEV_TOOL']
      )});
        this.template = items;
      });
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
