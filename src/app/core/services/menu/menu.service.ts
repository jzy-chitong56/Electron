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
      let template : Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> = [
      // {
      //    label: 'Install',
        // submenu: [
        //   {
        //     label: 'Install Reforged on Folder',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-1');
        //     }
        //   },
        //   {
        //     label: 'Install Reforged on Folder (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-2');
        //     }
        //   },
        //   {
        //     label: 'Install Reforged on Folder (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-0');
        //     }
        //   },
        //   {
        //     label: 'Install Reforged on Map',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-1');
        //     }
        //   },
        //   {
        //     label: 'Install Reforged on Map (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-1');
        //     }
        //   },
        //   {
        //     label: 'Install Reforged on Map (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-0');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Folder',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-1-TFT');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Folder (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-2-TFT');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Folder (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-0-TFT');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Map',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-1-TFT');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Map (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-2-TFT');
        //     }
        //   },
        //   {
        //     label: 'Install classic TFT on Map (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-0-TFT');
        //     }
        //   },
        //           {
        //     label: 'Install classic ROC on Folder',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-1-ROC');
        //     }
        //   },
        //   {
        //     label: 'Install classic ROC on Folder (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-2-ROC');
        //     }
        //   },
        //   {
        //     label: 'Install classic ROC on Folder (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-folder-0-ROC');
        //     }
        //   },
        //   {
        //     label: 'Install classic ROC on Map',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-1-ROC');
        //     }
        //   },
        //   {
        //     label: 'Install classic ROC on Map (VS AI Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-2-ROC');
        //     }
        //   }
        //   {
        //     label: 'Install classic ROC on Map (No Commander)',
        //     click: () => {
        //       this.electronService.ipcRenderer.send('install-map-0-ROC');
        //     }
        //   }
        //   // TODO: recreate MakeTFT script
        //   // FIXME: convert MakeTFTBase.bat to JS script
        //   // FIXME: convert MakeTFT.bat to JS script
        //   // FIXME: convert ejass.pl to JS script
        //   //{
        //   //  label: 'Compile',
        //   //  click: () => {
        //   //    this.electronService.ipcRenderer.send('compile');
        //   //  }
        //   // },
        //   // TODO: recreate MakeOptTFT.bat script
        //   // { label: 'Compile, Optimize' },
        //   // TODO: recreate MakeVAITFT.bat script
        //   // { label: 'Compile AMAI vs Default AI' },
        // ]
      // },
      ];

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
                  this.electronService.ipcRenderer.send('setlang-English');
                  console.log('setlang-English');
                }
              },
              {
                label: translations['PAGES.MENU.CHINESE'],
                type: 'radio',
                checked: this.translate.currentLang == 'zh',
                click: () => {
                  this.translate.use('zh')
                  this.electronService.ipcRenderer.send('setlang-Chinese');
                }
              },
              {
                label: translations['PAGES.MENU.FRENCH'],
                type: 'radio',
                checked: this.translate.currentLang == 'fr',
                click: () => {
                  this.translate.use('fr')
                  this.electronService.ipcRenderer.send('setlang-French');
                }
              },
              {
                label: translations['PAGES.MENU.GERMAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'de',
                click: () => {
                  this.translate.use('de')
                  this.electronService.ipcRenderer.send('setlang-Deutsch');
                }
              },
              {
                label: translations['PAGES.MENU.NORWEGIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'no',
                click: () => {
                  this.translate.use('no')
                  this.electronService.ipcRenderer.send('setlang-Norwegian');
                }
              },
              {
                label: translations['PAGES.MENU.PORTUGUESE'],
                type: 'radio',
                checked: this.translate.currentLang == 'pt',
                click: () => {
                  this.translate.use('pt')
                  this.electronService.ipcRenderer.send('setlang-Portuguese');
                }
              },
              {
                label: translations['PAGES.MENU.ROMANIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'ro',
                click: () => {
                  this.translate.use('ro')
                  this.electronService.ipcRenderer.send('setlang-Romanian');
                }
              },
              {
                label: translations['PAGES.MENU.RUSSIAN'],
                type: 'radio',
                checked: this.translate.currentLang == 'ru',
                click: () => {
                  this.translate.use('ru')
                  this.electronService.ipcRenderer.send('setlang-Russian');
                }
              },
              {
                label: translations['PAGES.MENU.SPANISH'],
                type: 'radio',
                checked: this.translate.currentLang == 'es',
                click: () => {
                  this.translate.use('es')
                  this.electronService.ipcRenderer.send('setlang-Spanish');
                }
              },
              {
                label: translations['PAGES.MENU.SWEDISH'],
                type: 'radio',
                checked: this.translate.currentLang == 'sv',
                click: () => {
                  this.translate.use('sv')
                  this.electronService.ipcRenderer.send('setlang-Swedish');
                }
              }
            ]
          }
        );
      });

      this.translate.get([_('PAGES.MENU.FULLSCREEN'), _('PAGES.MENU.DEV_TOOL')
      ]).subscribe((translations: { [key: string]: string }) => {
        template.push(
          {
            label: translations['PAGES.MENU.FULLSCREEN'],
            role: 'togglefullscreen',
            click: () => {
              this.electronService.ipcRenderer.send('setlang-Swedish');
            }
          },
          {
            label: translations['PAGES.MENU.DEV_TOOL'],
            role: 'toggleDevTools' 
          }
        );
      });
      template.push(
        {
          label: translations['PAGES.DETAIL.TITLE'],
          click: () => {
            this.electronService.ipcRenderer.send('setlang-Spanish');
          }
          }
       );

      // template.push({
      //   label: 'View',
      //   submenu: [
      //     //{ role: 'reload' },
      //     //{ role: 'forceReload' },
      //     { role: 'toggleDevTools' },
      //     { type: 'separator' },
      //     { role: 'resetZoom' },
      //     { role: 'zoomIn' },
      //     { role: 'zoomOut' },
      //     { type: 'separator' },
      //     { role: 'togglefullscreen' }
      //   ]
      // });

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
