import { ChangeDetectorRef, Component } from '@angular/core';
import { ElectronService, MenuService, HomeService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { InstallModel } from '../../commons/models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = '';
  public active = false;
  public couldClose = false;
  public messages = [];

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private menuService: MenuService,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
  ) {

    const Lang = this.translate.getBrowserLang();
    function handleTranslation(Lang) {  
      console.log('getlang', Lang);  
      this.translate.get('PAGES.APP.OPEN_MAP').subscribe((transopenmap: string) => {  
        this.electronService.ipcRenderer.send('Trans_openMapr',transopenmap);  
      });  
      this.translate.get('PAGES.APP.OPEN_DIRECTORY').subscribe((transopendir: string) => {  
        this.electronService.ipcRenderer.send('Trans_openDir',transopendir);  
      });  
      this.translate.get('PAGES.APP.MAP_FILE').subscribe((transmapfile: string) => {  
        this.electronService.ipcRenderer.send('Trans_mapFile',transmapfile);  
      });  
    }  
      
    if (Lang === 'en' || Lang === 'zh') {  
      this.translate.setDefaultLang(Lang);  
      handleTranslation(Lang);  
    } else {  
      console.log('errlang - backen', 'en');  
      this.translate.setDefaultLang('en');  
      handleTranslation('en');
    }
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      this.menuService.createMenu();
      let Tltle = null
      let InstallToFolder = null
      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-init', (_, args: InstallModel) => {
        console.log('args', args)
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING').subscribe((transtitle: string) => {
          Tltle = transtitle
        });
        this.title = `Tltle ${args.response}`;
        this.active = true;
        this.couldClose = false;
        this.messages = [];
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING_TO_FOLDER').subscribe((translation: string) => {
          InstallToFolder = translation
        });
        !args.isMap && this.messages && this.messages.push(`InstallToFolder ${args.response}`);
        // disable the menu while the script is running
        this
          .menuService
          .changeEnabledMenuState(false);
        this
          .homeService
          .changeEnabledHomeState(false);

        // force update in angular view after update any variable
        // because we are in a IPC async
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-empty', (_, args) => {
        console.log('args', args);
        this.active = false;
        this.couldClose = true;
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-exit', (_, args) => {
        let Tltle = null
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING_DONE').subscribe((transtitle: string) => {
          Tltle = transtitle
        });
        this.title = `Tltle`;
        this.couldClose = true;

        this
          .menuService
          .changeEnabledMenuState(true);
        this
          .homeService
          .changeEnabledHomeState(true);

        this.cdr.detectChanges();
      });

      this.electronService.ipcRenderer.on('on-install-message', (_, args) => {
        console.log('args', args);
        this.messages && this.messages.push(args);
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-error', (_, args) => {
        console.log('args', args);
        this.couldClose = true;

        this
          .menuService
          .changeEnabledMenuState(true);
        this
          .homeService
          .changeEnabledHomeState(true);

        this.cdr.detectChanges();
      });

    } else {
      console.log('Run in browser');
    }
  }

  public closeCmd() {
    this.couldClose ? (this.active = false) : null;
  }
}
