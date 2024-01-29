import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
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
  @ViewChild('ImagesROCEnable', { static: true }) Images_ROC_Enable: ElementRef;
  @ViewChild('ImagesROCDisable', { static: true }) Images_ROC_Disable: ElementRef;
  @ViewChild('imageROC', { static: true }) image_Container_ROC: ElementRef;
  @ViewChild('ImagesTFTEnable', { static: true }) Images_TFT_Enable: ElementRef;
  @ViewChild('ImagesTFTDisable', { static: true }) Images_TFT_Disable: ElementRef;
  @ViewChild('imageTFT', { static: true }) image_Container_TFT: ElementRef;
  @ViewChild('ImagesREFEnable', { static: true }) Images_REF_Enable: ElementRef;
  @ViewChild('ImagesREFDisable', { static: true }) Images_REF_Disable: ElementRef;
  @ViewChild('imageREF', { static: true }) image_Container_REF: ElementRef;
  @ViewChild('Mode_Switch_State', { static: true }) ModeSwitch: ElementRef;
  @ViewChild('BJ_Switch_State', { static: true }) BJSwitch: ElementRef;
  ROCShown: boolean = false; 
  TFTShown: boolean = false; 
  REFShown: boolean = false; 
  Mode_Switch_State: boolean = true;
  BJ_Switch_State: boolean = true;
  
  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.Images_ROC_Disable.nativeElement.style.display = 'block';
    this.Images_ROC_Enable.nativeElement.style.display = 'none';
    this.Images_TFT_Disable.nativeElement.style.display = 'block';
    this.Images_TFT_Enable.nativeElement.style.display = 'none';
    this.Images_REF_Disable.nativeElement.style.display = 'block';
    this.Images_REF_Enable.nativeElement.style.display = 'none';
    
  }


  onMouseEnter(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
    switch (action) {
      case 'ROC':
        if (!this.ROCShown) {  
          this.Images_ROC_Disable.nativeElement.style.display = 'none';
          this.Images_ROC_Enable.nativeElement.style.display = 'block';
          console.log('in roc');
        }
        break;
      case 'TFT':
        if (!this.TFTShown) {  
          this.Images_TFT_Disable.nativeElement.style.display = 'none';
          this.Images_TFT_Enable.nativeElement.style.display = 'block';
          console.log('in tft');
        }
        break;
      case 'REF':
        if (!this.REFShown) {  
          this.Images_REF_Disable.nativeElement.style.display = 'none';
          this.Images_REF_Enable.nativeElement.style.display = 'block';
          console.log('in ref');
        }
        break;
      default:
        console.log('Mouse entered an element');
        break;
    }
  }

  // 鼠标移出事件处理函数
  onMouseLeave(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
    switch (action) {
      case 'ROC':
        if (!this.ROCShown) {  
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          console.log('out roc');
        }
      break;
      case 'TFT':
        if (!this.TFTShown) {  
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
          console.log('out tft');
        }
      break;
      case 'REF':
        if (!this.REFShown) {  
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
          console.log('out ref');
        }
      default:
        console.log('Mouse out an element');
        break;
    }
  }

  // 点击事件处理函数
  onClick(event: MouseEvent) {
    const action = (event.target as HTMLElement).dataset.action;
    switch (action) {
      case 'ROC':
        if (!this.ROCShown) {  
          let modeState = this.Mode_Switch_State ? '-folder' : '-map';
          let bjState = this.BJ_Switch_State ? '' : '-noc';
          this.Images_ROC_Disable.nativeElement.style.display = 'none';
          this.Images_ROC_Enable.nativeElement.style.display = 'block';
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
          this.electronService.ipcRenderer.send('install${modeState}${bjState}ver');
          console.log('c roc');
        } else {
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          console.log('c roc-at');
        }
        this.ROCShown = !this.ROCShown;
        break;
      case 'TFT':
        if (!this.TFTShown) {  
          let modeState = this.Mode_Switch_State ? '-folder' : '-map';
          let bjState = this.BJ_Switch_State ? '' : '-noc';
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Disable.nativeElement.style.display = 'none';
          this.Images_TFT_Enable.nativeElement.style.display = 'block';
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
          console.log('c tft');
        } else {
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
          console.log('c tft-at');
        }
        this.TFTShown = !this.TFTShown;
        break;
      case 'REF':
        if (!this.REFShown) {  
          let modeState = this.Mode_Switch_State ? '-folder' : '-map';
          let bjState = this.BJ_Switch_State ? '' : '-noc';
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Disable.nativeElement.style.display = 'none';
          this.Images_REF_Enable.nativeElement.style.display = 'block';
          console.log('c ref');
        } else {
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
          console.log('c ref-at');
        }
        this.REFShown = !this.REFShown;
      case 'Mode':
        this.Mode_Switch_State = !this.Mode_Switch_State; 
        console.log('c mode');
      case 'BJ':
        this.BJ_Switch_State = !this.BJ_Switch_State; 
        console.log('c bj');
      default:
        console.log('Mouse click an element');
        break;
    }
  }
  constructor(
    private router: Router,
    private resolver: ComponentResolver,
    private electronService: ElectronService,
  ) { }

}
