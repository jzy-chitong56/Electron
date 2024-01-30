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
  

  @ViewChild('imageROC') image_Container_ROC: ElementRef;
  @ViewChild('imageTFT') image_Container_TFT: ElementRef;
  @ViewChild('imageREF') image_Container_REF: ElementRef;
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
  // @HostListener('mouseover', ['$event'])
  onMouseEnter(event: any): void {
    // const action = (event.target as HTMLElement).dataset.action;
    const element = event.target as HTMLElement;
    console.log('0 :', element);
    if (element.id === 'imageROC') {
        if (!this.ROCInstall) {  
          //this.Images_ROC_Disable.nativeElement.style.display = 'none';
          //this.Images_ROC_Enable.nativeElement.style.display = 'block';
          this.Images_ROC_Shown = true;
          console.log('in roc');
        }
    }
    if (element.id === 'imageTFT') {
        if (!this.TFTInstall) {  
          //this.Images_TFT_Disable.nativeElement.style.display = 'none';
          //this.Images_TFT_Enable.nativeElement.style.display = 'block';
          this.Images_TFT_Shown = true;
          console.log('in tft');
        }
    }
    if (element.id === 'imageREF') {
        if (!this.REFInstall) {  
          //this.Images_REF_Disable.nativeElement.style.display = 'none';
          //this.Images_REF_Enable.nativeElement.style.display = 'block';
          this.Images_REF_Shown = true;
          console.log('in ref');
        }
    }
  }

  // 鼠标移出事件处理函数
  @HostListener('mouseout', ['$event'])
  onMouseLeave(event: any): void {
    const action = (event.target as HTMLElement).dataset.action;
            console.log('1 action:', action);
    switch (action) {
      case 'ROCEVENT':
        if (!this.ROCInstall) {  
          //this.Images_ROC_Disable.nativeElement.style.display = 'block';
          //this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_ROC_Shown = false;
          console.log('out roc');
        }
        break;
      case 'TFTEVENT':
        if (!this.TFTInstall) {  
          //this.Images_TFT_Disable.nativeElement.style.display = 'block';
          //this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Shown = false;
          console.log('out tft');
        }
        break;
      case 'REFEVENT':
        if (!this.REFInstall) {  
          //this.Images_REF_Disable.nativeElement.style.display = 'block';
          //this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Shown = false;
          console.log('out ref');
        }
        break;
      default:
        console.log('y action:', action);
        break;
    }
  }

  // 点击事件处理函数
  @HostListener('click', ['$event'])
  onClick(event: any): void {
    const action = (event.target as HTMLElement).dataset.action;
            console.log('2 action:', action);
    switch (action) {
      case 'ROCEVENT':
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
      case 'TFTEVENT':
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
      case 'REFEVENT':
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
      default:
        console.log('z action:', action);
        break;
    }
  }
  constructor(
    private router: Router,
    private electronService: ElectronService,
  ) { }

}
