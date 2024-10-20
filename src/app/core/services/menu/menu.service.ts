import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { TranslateService, TranslatePipe, TranslateDirective, _ , LangChangeEvent} from "@codeandweb/ngx-translate";


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService
    ) { }

    private getTemplate(translate : TranslateService) : Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> { 

      this.translate.get([_('PAGES.MENU.SELECT_LANG'), _('PAGES.MENU.ENGLISH'), _('PAGES.MENU.CHINESE'), _('PAGES.MENU.FRENCH')
        , _('PAGES.MENU.GERMAN'), _('PAGES.MENU.NORWEGIAN'), _('PAGES.MENU.PORTUGUESE'), _('PAGES.MENU.ROMANIAN')
        , _('PAGES.MENU.RUSSIAN'), _('PAGES.MENU.SPANISH'), _('PAGES.MENU.SWEDISH')
      ]).subscribe((translations: { [key: string]: string }) => {
        template.push(
          {
            label: translations['PAGES.MENU.SELECT_LANG'],
            submenu: [
              {
                label: translations['PAGES.MENU.ENGLISH'],
                type: 'radio',
                checked: this.translate.currentLang == 'en',
                click: () => {
                  this.translate.use('en')
                }
              },
              {
                label: translations['PAGES.MENU.CHINESE'],
                type: 'radio',
                checked: this.translate.currentLang == 'zh',
                click: () => {
                  this.translate.use('zh')
                }
              },
              {
                label: translations['PAGES.MENU.FRENCH'],
                type: 'radio',
                checked: this.translate.currentLang == 'fr',
                click: () => {
                  this.translate.use('fr')
                }
              },
              {
                label: translations['PAGES.MENU.GERMAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'de',
                click: () => {
                  this.translate.use('de')
                }
              },
              {
                label: translations['PAGES.MENU.NORWEGIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'no',
                click: () => {
                  this.translate.use('no')
                }
              },
              {
                label: translations['PAGES.MENU.PORTUGUESE'],
                type: 'radio',
                checked: this.translate.currentLang == 'pt',
                click: () => {
                  this.translate.use('pt')
                }
              },
              {
                label: translations['PAGES.MENU.ROMANIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'ro',
                click: () => {
                  this.translate.use('ro')
                }
              },
              {
                label: translations['PAGES.MENU.RUSSIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'ru',
                click: () => {
                  this.translate.use('ru')
                }
              },
              {
                label: translations['PAGES.MENU.SPANISH'],
                type: 'radio',
                checked: this.translate.currentLang == 'es',
                click: () => {
                  this.translate.use('es')
                }
              },
              {
                label: translations['PAGES.MENU.SWEDISH'],
                type: 'radio',
                checked: this.translate.currentLang == 'sv',
                click: () => {
                  this.translate.use('sv')
                }
              }
            ]
          }
        );
      });

      template.push({
        label: 'fullscreen',
        role: 'togglefullscreen',
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools',
      });

      console.log(template);

      return template;
  }

  public createMenu() {
    if(this.electronService.isElectron) {
      const { Menu } = this.electronService;
      const menu = Menu.buildFromTemplate(this.getTemplate(this.translate));
      Menu.setApplicationMenu(menu);
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        const menu = Menu.buildFromTemplate(this.getTemplate(this.translate));
        Menu.setApplicationMenu(menu);
      });
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
