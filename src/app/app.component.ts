import { ChangeDetectorRef, Component } from '@angular/core';
import { ElectronService, MenuService, HomeService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { InstallModel } from '../../commons/models';
import { forkJoin } from 'rxjs';

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

    if (
      Lang === 'en' ||
      Lang === 'zh' 
      // add *src/app/assets/xx.json* , and add other languages to here
    ){
      //console.log('getlang', Lang);  
      this.translate.setDefaultLang(Lang);  
    } else {  
      //console.log('errlang - go en back', 'en');  
      this.translate.setDefaultLang('en');  
    }
    forkJoin({
      transopenmap: this.translate.get('PAGES.APP.OPEN_MAP'),
      transopendir: this.translate.get('PAGES.APP.OPEN_DIRECTORY'),
      transmapfile: this.translate.get('PAGES.APP.MAP_FILE')
    }).subscribe((res) => {
      const data = {  
        res1: res.transopenmap,
        res2: res.transopendir,
        res3: res.transmapfile,
      };  
      this.electronService.ipcRenderer.send('Trans',data as any);
    });
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      this.menuService.createMenu();
      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-init', (_, args: InstallModel) => {
        console.log('args-install-init', args)
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING').subscribe((res) => {
          this.title = `${res} ${args.response}`;
        });
        this.active = true;
        this.couldClose = false;
        this.messages = [];
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING_TO_FOLDER').subscribe((res) => {
          !args.isMap && this.messages && this.messages.push(`${res} ${args.response}`);
        });
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
        console.log('args-install-empty', args);
        this.active = false;
        this.couldClose = true;
        this
          .homeService
          .changeEnabledHomeState(true);

        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-exit', (_, args) => {
        console.log('args-install-exit', args);
        // TODO: use i18n to translate
        this.translate.get('PAGES.APP.INSTALLING_DONE').subscribe((res) => {
          this.title = `${res}`;
        });
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
        console.log('args-install-message', args);
        this.messages && this.messages.push(args);
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-error', (_, args) => {
        console.log('args-install-error', args);
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
