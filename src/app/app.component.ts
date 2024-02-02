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

    console.log('APP_CONFIG', APP_CONFIG);

    function setMainTrans(language: string) {  
      console.log('setlang', language);
      this.translate.setDefaultLang(language);
      // TODO: use i18n to translate
      this.translate.get('PAGES.APP.OPEN_MAP').subscribe(transopenmap => {
      this.electronService.ipcRenderer.send('Trans_openMap', transopenmap);})
      this.translate.get('PAGES.APP.OPEN_DIRECTORY').subscribe(transopendir => {
      this.electronService.ipcRenderer.send('Trans_openDir', transopendir);})
      this.translate.get('PAGES.APP.MAP_FILE').subscribe(transmapfile => {
      this.electronService.ipcRenderer.send('Trans_mapFile', transmapfile);})
    }

    const Lang = translate.getBrowserLang();
    if (Lang === 'en'|| Lang === 'zh') {
      console.log('getlang', Lang);
      setMainTrans(Lang);
    } else {
      console.log('errlang - backen', Lang);
      setMainTrans('en');
    }

    if (electronService.isElectron) {
      this.menuService.createMenu();

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-init', (_, args: InstallModel) => {
        console.log('args', args)
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING').subscribe(transtitle => {
        this.title = `transtitle ${args.response}`;});
        this.active = true;
        this.couldClose = false;
        this.messages = [];
        // TODO: use i18n to translate
        if (!args.isMap && this.messages) {
          this.translate.get('PAGES.APP.INSTALLING_TO_FOLDER').subscribe(translation => {
          this.messages.push(`translation ${args.response}`);});
        }
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
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING_DONE').subscribe(transtitle => {
        this.title = `${transtitle} ${args.response}`;});
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
