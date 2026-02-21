import { Component, OnInit, ViewChild, ElementRef, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services/electron/electron.service';
import { TranslateService, LangChangeEvent } from "@codeandweb/ngx-translate";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gamePaths = {
    TFT: { 
      path: null as string | null,
      displayText: '',
      installed: false
    },
    REF: { 
      path: null as string | null,
      displayText: '',
      installed: false
    },
    ROC: { 
      path: null as string | null,
      displayText: '',
      installed: false
    }
  };

  constructor(private electronService: ElectronService, private translate: TranslateService) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.loadDefaultPath();
  }
  loadDefaultPath(): void {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.invoke('file-operations', {
        operation: 'load-default-path'
      }).then((settings: any) => {
        console.log('Loaded settings:', settings);
        if (settings) {
          // 确保每个游戏类型都有独立的路径
          this.gamePaths.TFT.path = settings.TFT || null;
          this.gamePaths.REF.path = settings.REF || null;
          this.gamePaths.ROC.path = settings.ROC || null;
          
          // 为每个路径更新显示文本
          this.gamePaths.TFT.displayText = this.gamePaths.TFT.path ? this.formatPath(this.gamePaths.TFT.path) : '';
          this.gamePaths.REF.displayText = this.gamePaths.REF.path ? this.formatPath(this.gamePaths.REF.path) : '';
          this.gamePaths.ROC.displayText = this.gamePaths.ROC.path ? this.formatPath(this.gamePaths.ROC.path) : '';
        }
      }).catch(error => {
        console.error('Error loading paths:', error);
      });
    }
  }

  private formatPath(path: string, maxLength = 30): string {
    if (path.length <= maxLength) return path;
    const parts = path.split(/[\\/]/);
    if (parts.length <= 2) return path;
    const firstPart = parts[0];
    const lastPart = parts[parts.length - 1];
    const middleLength = maxLength - (firstPart.length + lastPart.length + 5);
    if (middleLength > 0) {
      return `${firstPart}/.../${lastPart}`;
    }
    return `${firstPart}/...${lastPart}`;
  }
  async selectGameFolder(gameType: 'TFT'|'REF'|'ROC'): Promise<void> {
    try {
      if (this.electronService.isElectron) {
        console.log(`Selecting folder for ${gameType}`);
        const result = await this.electronService.ipcRenderer.invoke('file-operations', {
          operation: 'select-folder',
          payload: this.gamePaths[gameType].path
        });
        
        if (result && result.length > 0) {
          this.gamePaths[gameType].path = result[0];
          this.gamePaths[gameType].displayText = this.formatPath(result[0]);
          await this.electronService.ipcRenderer.invoke('file-operations', {
            operation: 'save-default-path',
            payload: { gameType, path: result[0] }
          });
          console.log(`${gameType} folder selected:`, result[0]);
        }
      }
    } catch (error) {
      console.error(`${gameType} folder selection failed:`, error);
    }
  }

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
  bjState: string = '';
  message: string = '';
  optimize: boolean = true;
  forcelang: boolean = false;
  installEvent: string = 'install'

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
          this.BJ_State = 0;
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
}