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
    let Installing_Title: string = '';
    let InstalDone_Title: string = '';
    let InstalDir_Mes: string = '';

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
      transmapfile: this.translate.get('PAGES.APP.MAP_FILE'),
      transmaptitle: this.translate.get('PAGES.APP.TITLE')
    }).subscribe((res) => {
      const data = {  
        res1: res.transopenmap,
        res2: res.transopendir,
        res3: res.transmapfile,
        res4: res.transmaptitle
      };  
      this.electronService.ipcRenderer.send('Trans',data as any);
    });
    Installing_Title = this.translate.get('PAGES.APP.INSTALLING');
    InstalDone_Title = this.translate.get('PAGES.APP.INSTALLING_DONE');
    InstalDir_Mes = this.translate.get('PAGES.APP.INSTALLING_TO_FOLER');
    console.log('init Installing Title:', Installing_Title);
    console.log('init Install Done Title:', InstalDone_Title);
    console.log('init Install Directory Message:', InstalDir_Mes);
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      this.menuService.createMenu();
      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-init', (_, args: InstallModel) => {
        console.log('args-install-init', args)
        // TODO: use i18n to translate
        console.log('Installing Title:', Installing_Title);  
        this.title = `${Installing_Title} ${args.response}`;
        this.active = true;
        this.couldClose = false;
        this.messages = [];
        // TODO: use i18n to translate
        console.log('Install Directory Message:', InstalDir_Mes); 
        !args.isMap && this.messages && this.messages.push(`${InstalDir_Mes} ${args.response}`);
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
        console.log('Install Done Title:', InstalDone_Title);  
        this.title = InstalDone_Title;
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
