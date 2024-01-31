import { Component, OnInit, ViewChild, ElementRef, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services/electron/electron.service';
import { HomeService } from '../core/services/home/home.service';
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  Images_ROC_Shown: boolean = false; 
  Images_TFT_Shown: boolean = false; 
  Images_REF_Shown: boolean = false; 
  ROCInstall: boolean = false; 
  TFTInstall: boolean = false; 
  REFInstall: boolean = false; 
  Mode_State: boolean = true;
  BJ_State: boolean = true;
  isInteractive: boolean = true;
  
  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  public changeEnabledHomeState(state: boolean) {
    if(this.electronService.isElectron) {
      this.isInteractive = state;
      console.log('in set');
    }
    if (this.isInteractive) {
      this.Images_ROC_Shown = false; 
      this.Images_TFT_Shown = false; 
      this.Images_REF_Shown = false; 
      this.ROCInstall = false; 
      this.TFTInstall = false; 
      this.REFInstall = false; 
      this.Mode_State = true;
      this.BJ_State = true;
    }
  }
  
  // 鼠标移入事件处理函数
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

  // 鼠标移出事件处理函数
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

  // 点击事件处理函数
  @HostListener('click', ['$event', '$event.target.dataset.action'])
  onClick(event: MouseEvent, action: string) {
    if (this.isInteractive) { 
    switch (action) {
      case 'Roc':
        if (!this.ROCInstall) {
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          const message = `install${modeState}${bjState}-ROC`;
          this.Images_ROC_Shown = true;
          this.Images_TFT_Shown = false;
          this.Images_REF_Shown = false;
          this.TFTInstall = false;
          this.REFInstall = false;
          console.log('roc :', message); 
          this.electronService.ipcRenderer.send(message);
        } else {
          this.Images_ROC_Shown = false;
        }
        this.ROCInstall = !this.ROCInstall;
        break;
      case 'Tft':
        if (!this.TFTInstall) {
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          const message = `install${modeState}${bjState}-TFT`;
          this.Images_ROC_Shown = false;
          this.Images_TFT_Shown = true;
          this.Images_REF_Shown = false;
          this.ROCInstall = false;
          this.REFInstall = false;
          console.log('tft :', message); 
          this.electronService.ipcRenderer.send(message);
        } else {
          this.Images_TFT_Shown = false;
        }
        this.TFTInstall = !this.TFTInstall;
        break;
      case 'Ref':
        if (!this.REFInstall) {
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          const message = `install${modeState}${bjState}`;
          this.Images_ROC_Shown = false;
          this.Images_TFT_Shown = false;
          this.Images_REF_Shown = true;
          this.ROCInstall = false;
          this.TFTInstall = false;
          console.log('ref :', message); 
          this.electronService.ipcRenderer.send(message);
        } else {
          this.Images_REF_Shown = false;
        }
        this.REFInstall = !this.REFInstall;
        break;
      case 'Mode':
        this.Mode_State = !this.Mode_State; 
        break;
      case 'BJ':
        this.BJ_State = !this.BJ_State; 
        break;
    }
    };
  }

  
  constructor(
    private router: Router,
    private electronService: ElectronService,
    private homeService: HomeService,
  ) { }


}
