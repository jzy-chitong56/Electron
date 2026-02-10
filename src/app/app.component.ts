import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronService, MenuService } from './core/services';
import { TranslateService, TranslatePipe, TranslateDirective, _ as t_, LangChangeEvent } from "@codeandweb/ngx-translate";
import { APP_CONFIG } from '../environments/environment';
import { InstallModel } from '../../commons/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
  public title = '';
  public active = false;
  public couldClose = false;
  public messages = [];
  public currentFile = 0;
  public totalFiles = 0;
  public installingText = '';
  public pathText = '';

  @ViewChild('logareawrapper') private readonly logContainer: ElementRef; 
    
  ngAfterViewChecked() { this.scrollToBottom(); } 
    
  private scrollToBottom(): void { this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight; } 
  
  constructor(
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService,
    private readonly menuService: MenuService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    const lang = this.translate.getBrowserLang();
    this.translate.use(lang)
    console.log('APP_CONFIG', APP_CONFIG);
    this.translate.get(t_('PAGES.APP.INSTALLING')).subscribe((res: string) => {
      this.installingText = res;
    });

    // Refresh app when language changes
    this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get([t_('PAGES.HOME.TITLE'),t_('PAGES.ELECTRON.OPEN_MAP'), t_('PAGES.ELECTRON.OPEN_DIR'), t_('PAGES.ELECTRON.MAPFILE')]).subscribe((translations: { [key: string]: string } ) => {
        this.electronService.ipcRenderer.send('Trans', event.lang, translations);
      })
      this.cdr.detectChanges();
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get([t_('PAGES.HOME.TITLE'),t_('PAGES.ELECTRON.OPEN_MAP'), t_('PAGES.ELECTRON.OPEN_DIR'), t_('PAGES.ELECTRON.MAPFILE')]).subscribe((translations: { [key: string]: string } ) => {
        this.electronService.ipcRenderer.send('Trans', event.lang, translations);
      })
      this.cdr.detectChanges();
    });
    

    if (electronService.isElectron) {
      this.menuService.createMenu();

      this.electronService.ipcRenderer.on('on-install-progress', (_, args: { current: number, total: number }) => {
        if ( args.total > 0 && this.totalFiles < args.total) {
          this.totalFiles = args.total;
        }
        if (this.currentFile < this.totalFiles) {
          this.currentFile++;
          this.translate.get(t_('PAGES.APP.INSTALLING'), { 
            current: this.currentFile, 
            total: this.totalFiles,
            path: this.pathText 
          }).subscribe((res: string) => {
            this.title = res;
          })
        }
        console.log('totalFiles:', this.totalFiles , 'currentFile:', this.currentFile);
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-init', (_, args: InstallModel) => {
        console.log('args-install-init', args)
        this.translate.get(t_('PAGES.APP.INSTALLING'), this.currentFile/this.totalFiles, {path: args.response}).subscribe((res: string) => {
          this.title = res;
        });
        this.pathText = args.response;
        this.active = true;
        this.couldClose = false;
        this.messages = [];
        this.translate.get(t_('PAGES.APP.INSTALLING_DIR'), {path: args.response}).subscribe((res: string) => {
          !args.isMap && this.messages?.push(res);
        });

        // disable the menu while the script is running
        this
          .menuService
          .changeEnabledMenuState(false);

        // force update in angular view after update any variable
        // because we are in a IPC async
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-empty', (_, args) => {
        console.log('args-install-empty', args);
        this.active = false;
        this.couldClose = true;
        this.totalFiles = 0;
        this.currentFile = 0;
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-exit', (_, args) => {
        this.translate.get(t_('PAGES.APP.INSTALL_DONE')).subscribe((res: string) => {
          this.title = res;
        });
        this.couldClose = true;
        this.totalFiles = 0;
        this.currentFile = 0;
        this
          .menuService
          .changeEnabledMenuState(true);

        this.cdr.detectChanges();
      });

      // Handle standard messages
      this.electronService.ipcRenderer.on('on-install-message', (_, args) => {
        console.log('args-install-message', args);
        this.messages?.push(args);
        this.cdr.detectChanges();
      });

      // TODO: add 'push notification'/'notification'
      this.electronService.ipcRenderer.on('on-install-error', (_, args) => {
        console.log('args-install-error', args);
        this.couldClose = true;
        this.totalFiles = 0;
        this.currentFile = 0;
        this
          .menuService
          .changeEnabledMenuState(true);

        this.cdr.detectChanges();
      });

    } else {
      console.log('Run in browser');
    }
  }

  public closeCmd() {
    if (this.couldClose) { 
      this.active = false;
    }
  }
}
