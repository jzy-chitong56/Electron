import { Component, OnInit, ViewChild, ElementRef, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services/electron/electron.service';
@Injectable({
  providedIn: 'root'
})
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  // @ViewChild('imageROC') Roc: ElementRef;
  // @ViewChild('imageTFT') Tft: ElementRef;
  // @ViewChild('imageREF') Ref: ElementRef;
  // @ViewChild('ModeSwitch') Mode_Switch_State: ElementRef;
  // @ViewChild('BJSwitch') BJ_Switch_State: ElementRef;
  Images_ROC_Shown: boolean = false; 
  Images_TFT_Shown: boolean = false; 
  Images_REF_Shown: boolean = false; 
  ROCInstall: boolean = false; 
  TFTInstall: boolean = false; 
  REFInstall: boolean = false; 
  Mode_State: boolean = true;
  BJ_State: boolean = true;
  
  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  // 鼠标移入事件处理函数
    onMouseEnter(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
      console.log('0 :', action);

console.log('0 :', event.target);  

switch (action) {
     case 'Roc':{
        if (!this.ROCInstall) {  
          //this.Images_ROC_Disable.nativeElement.style.display = 'none';
          //this.Images_ROC_Enable.nativeElement.style.display = 'block';
          this.Images_ROC_Shown = true;
          console.log('in roc');
        }
      break;
    }
     case 'Tft':{
        if (!this.TFTInstall) {  
          //this.Images_TFT_Disable.nativeElement.style.display = 'none';
          //this.Images_TFT_Enable.nativeElement.style.display = 'block';
          this.Images_TFT_Shown = true;
          console.log('in tft');
        }
      break;
    }
     case 'Ref':{
        if (!this.REFInstall) {  
          //this.Images_REF_Disable.nativeElement.style.display = 'none';
          //this.Images_REF_Enable.nativeElement.style.display = 'block';
          this.Images_REF_Shown = true;
          console.log('in ref');
        }
     break;
    }
   }
  }

  // 鼠标移出事件处理函数
  @HostListener('mouseout', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
            console.log('1 action:', action);
    switch (action) {
      case 'Roc':
        if (!this.ROCInstall) {  
          //this.Images_ROC_Disable.nativeElement.style.display = 'block';
          //this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_ROC_Shown = false;
          console.log('out roc');
        }
        break;
      case 'Tft':
        if (!this.TFTInstall) {  
          //this.Images_TFT_Disable.nativeElement.style.display = 'block';
          //this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Shown = false;
          console.log('out tft');
        }
        break;
      case 'Ref':
        if (!this.REFInstall) {  
          //this.Images_REF_Disable.nativeElement.style.display = 'block';
          //this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Shown = false;
          console.log('out ref');
        }
        break;
    }
  }

  // 点击事件处理函数
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
            console.log('2 action:', action);
    switch (action) {
      case 'Roc':
        if (!this.ROCInstall) {  
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          // this.Images_ROC_Disable.nativeElement.style.display = 'none';
          // this.Images_ROC_Enable.nativeElement.style.display = 'block';
          // this.Images_TFT_Disable.nativeElement.style.display = 'block';
          // this.Images_TFT_Enable.nativeElement.style.display = 'none';
          // this.Images_REF_Disable.nativeElement.style.display = 'block';
          // this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.Images_ROC_Shown = true;
          this.Images_TFT_Shown = false;
          this.Images_REF_Shown = false;
          this.electronService.ipcRenderer.send('install${modeState}${bjState}ver');
          console.log('c roc');
        } else {
          // this.Images_ROC_Disable.nativeElement.style.display = 'block';
          // this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_ROC_Shown = false;
          console.log('c roc-at');
        }
        this.ROCInstall = !this.ROCInstall;
        break;
      case 'Tft':
        if (!this.TFTInstall) {  
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          // this.Images_ROC_Disable.nativeElement.style.display = 'block';
          // this.Images_ROC_Enable.nativeElement.style.display = 'none';
          // this.Images_TFT_Disable.nativeElement.style.display = 'none';
          // this.Images_TFT_Enable.nativeElement.style.display = 'block';
          // this.Images_REF_Disable.nativeElement.style.display = 'block';
          // this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.Images_ROC_Shown = false;
          this.Images_TFT_Shown = true;
          this.Images_REF_Shown = false;
          this.electronService.ipcRenderer.send('install${modeState}${bjState}ver');
          console.log('c tft');
        } else {
          // this.Images_TFT_Disable.nativeElement.style.display = 'block';
          // this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Shown = false;
          console.log('c tft-at');
        }
        this.TFTInstall = !this.TFTInstall;
        break;
      case 'Ref':
        if (!this.REFInstall) {  
          let modeState = this.Mode_State ? '-folder' : '-map';
          let bjState = this.BJ_State ? '' : '-noc';
          // this.Images_ROC_Disable.nativeElement.style.display = 'block';
          // this.Images_ROC_Enable.nativeElement.style.display = 'none';
          // this.Images_TFT_Disable.nativeElement.style.display = 'block';
          // this.Images_TFT_Enable.nativeElement.style.display = 'none';
          // this.Images_REF_Disable.nativeElement.style.display = 'none';
          // this.Images_REF_Enable.nativeElement.style.display = 'block';
          this.Images_ROC_Shown = false;
          this.Images_TFT_Shown = false;
          this.Images_REF_Shown = true;
          this.electronService.ipcRenderer.send('install${modeState}${bjState}ver');
          console.log('c ref');
        } else {
          // this.Images_REF_Disable.nativeElement.style.display = 'block';
          // this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Shown = false;
          console.log('c ref-at');
        }
        this.REFInstall = !this.REFInstall;
        break;
      case 'Mode':
        this.Mode_State = !this.Mode_State; 
        console.log('c mode');
        break;
      case 'BJ':
        this.BJ_State = !this.BJ_State; 
        console.log('c bj');
        break;
    }
  }
  constructor(
    private router: Router,
    private electronService: ElectronService,
  ) { }

}
