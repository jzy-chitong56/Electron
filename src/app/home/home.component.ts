import { Component, OnInit, ViewChild, ElementRef, HostListener, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services/electron/electron.service';
import { TranslateService, LangChangeEvent } from "@codeandweb/ngx-translate";
import { Subscription } from 'rxjs';
// 移除 firstValueFrom 导入


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription | null = null;
  private pathTranslationSub: Subscription | null = null;

  Images_ROC_Shown: boolean = false;
  Images_TFT_Shown: boolean = false; 
  Images_REF_Shown: boolean = false; 
  ROCInstall: boolean = false; 
  TFTInstall: boolean = false; 
  REFInstall: boolean = false; 
  Mode_State: boolean = true;
  BJ_State: number = 1;
  isInteractive: boolean = true;
  modeState: string = '-folder';
  bjState: string = '-1';
  message: string = '';
  optimize: boolean = true;
  forcelang: boolean = false;
  installEvent: string = 'install'

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    // Load default path after component is initialized
    this.loadDefaultPath();
    // Subscribe to language changes to update path text dynamically
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePathText(); // Refresh text when language switches
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    if (this.pathTranslationSub) {
      this.pathTranslationSub.unsubscribe();
    }
  }

  @HostListener('mouseenter', ['$event', '$event.target.dataset.action'])
  onMouseEnter(event: MouseEvent, action: string) {
    if (this.isInteractive) {
      switch (action) {
        case 'Roc':
          if (!this.ROCInstall) {
            this.Images_ROC_Shown = true;
          }
          break;
        case 'Tft':
          if (!this.TFTInstall) {
            this.Images_TFT_Shown = true;
          }
          break;
        case 'Ref':
          if (!this.REFInstall) {
            this.Images_REF_Shown = true;
          }
          break;
      }
    };
  }

  @HostListener('mouseout', ['$event', '$event.target.dataset.action'])
  onMouseLeave(event: MouseEvent, action: string) {
    if (this.isInteractive) { 
      switch (action) {
        case 'Roc':
          if (!this.ROCInstall) {
            this.Images_ROC_Shown = false;
          }
          break;
        case 'Tft':
          if (!this.TFTInstall) {
            this.Images_TFT_Shown = false;
          }
          break;
        case 'Ref':
          if (!this.REFInstall) {
            this.Images_REF_Shown = false;
          }
          break;
      }
    };
  }

  @HostListener('click', ['$event', '$event.target.dataset.action'])
  onClick(event: MouseEvent, action: string) {
    if (this.isInteractive) {
      switch (action) {
        case 'Roc':
          if (!this.ROCInstall) {
            this.message = `install${this.modeState}${this.bjState}-ROC`;
            this.Images_ROC_Shown = true;
            this.Images_TFT_Shown = false;
            this.Images_REF_Shown = false;
            this.TFTInstall = false;
            this.REFInstall = false;
            this.ROCInstall = !this.ROCInstall;
            this.electronService.ipcRenderer.send(this.installEvent, 'ROC', this.Mode_State, this.BJ_State, this.optimize, this.forcelang);
            console.log('message',this.message);
          }
          break;
        case 'Tft':
          if (!this.TFTInstall) {
            this.message = `install${this.modeState}${this.bjState}-TFT`;
            this.Images_ROC_Shown = false;
            this.Images_TFT_Shown = true;
            this.Images_REF_Shown = false;
            this.ROCInstall = false;
            this.REFInstall = false;
            this.TFTInstall = !this.TFTInstall;
            this.electronService.ipcRenderer.send(this.installEvent, 'TFT', this.Mode_State, this.BJ_State, this.optimize, this.forcelang);
            console.log('message',this.message);
          }
          break;
        case 'Ref':
          if (!this.REFInstall) {
            this.message = `install${this.modeState}${this.bjState}`;
            this.Images_ROC_Shown = false;
            this.Images_TFT_Shown = false;
            this.Images_REF_Shown = true;
            this.ROCInstall = false;
            this.TFTInstall = false;
            this.REFInstall = !this.REFInstall;
            this.electronService.ipcRenderer.send(this.installEvent, 'REFORGED', this.Mode_State, this.BJ_State, this.optimize, this.forcelang);
            console.log('message',this.message);
          }
          break;
      }
    };
    this.Images_ROC_Shown = false;
    this.Images_TFT_Shown = false;
    this.Images_REF_Shown = false;
    this.ROCInstall = false;
    this.TFTInstall = false;
    this.REFInstall = false;
  }

  onInputChange(inputId: string) {
    if (this.isInteractive) { 
      switch (inputId) {
        case 'ModeSwitch':
          this.Mode_State = !this.Mode_State;
          this.modeState = this.Mode_State ? '-folder' : '-map';
          console.log('mode',this.modeState,this.Mode_State);
          break;
        case 'BJoptionOn':
          this.bjState = '';
          this.BJ_State = 1;
          console.log('BJ',this.bjState);
          break;
        case 'BJoptionVsAI':
          this.bjState = '-vai';
          this.BJ_State = 2;
          console.log('BJ',this.bjState);
          break;
        case 'BJoptionOff':
          this.bjState = '-noc';
          console.log('BJ',this.bjState);
            break;
        case 'Optimise':
          this.optimize = !this.optimize;
          if (this.optimize) {
            this.forcelang = false;
          }
          break;
        case 'ForceLang':
          this.forcelang = !this.forcelang;
          if (this.forcelang) {
            this.optimize = false;
          }
          break;     
      }
    };
  }

  defaultPath: string | null = null;
  defaultPathText: string = '';

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private translate: TranslateService
  ) { 
    // 去掉调试信息，保持简洁
  }

  async loadDefaultPath(): Promise<void> {
    try {
      console.log('Attempting to load default path...');
      this.defaultPath = await this.electronService.loadDefaultPath();
      console.log('Loaded default path:', this.defaultPath);
      console.log('Path type:', typeof this.defaultPath);
      console.log('Path is null?', this.defaultPath === null);
      console.log('Path is empty?', this.defaultPath === '');

      // Debug: Check if we're in Electron environment
      console.log('Is Electron:', this.electronService.isElectron);
      
      this.updatePathText(); // Use helper to handle translations
    } catch (error) {
      console.error('home - Error loading default path:', error);
      this.defaultPath = null;
      this.updatePathText(true); // Pass error flag
    }
  }

  // Helper: Update path text (stays in sync with language changes)
  private updatePathText(isError: boolean = false): void {
    // Unsubscribe from previous translation to prevent memory leaks
    if (this.pathTranslationSub) {
      this.pathTranslationSub.unsubscribe();
    }

    if (this.defaultPath) {
      this.defaultPathText = this.defaultPath;
      return;
    }

    // Get the correct translation key
    const key = isError 
      ? 'PAGES.HOME.CAN_NOT_GET_DEFAULT_PATH' 
      : 'PAGES.HOME.NO_SET_DEFAULT_PATH';

    // Subscribe to translation (auto-updates when language changes)
    this.pathTranslationSub = this.translate.get(key).subscribe(translatedText => {
      this.defaultPathText = translatedText;
    });
  }

  async selectDefaultFolder(): Promise<void> {
    try {
      console.log('Attempting to select default folder...');
      const selectedPath = await this.electronService.selectFolder(this.defaultPath || null);
      console.log('Selected path:', selectedPath);
      
      if (!selectedPath) {
        console.log('Folder selection canceled');
        return;
      }
      
      await this.electronService.saveDefaultPath(selectedPath);
      this.defaultPath = selectedPath;
      this.defaultPathText = selectedPath;
      console.log('Selected default path:', this.defaultPath);
    } catch (error) {
      console.error('Error selecting default folder:', error);
    }
  }
}
