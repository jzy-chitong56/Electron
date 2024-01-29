import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'electron';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('ImagesROCEnable', { static: false }) Images_ROC_Enable: ElementRef;
  @ViewChild('ImagesROCDisable', { static: false }) Images_ROC_Disable: ElementRef;
  @ViewChild('imageROC', { static: false }) image_Container_ROC: ElementRef;
  @ViewChild('ImagesTFTEnable', { static: false }) Images_TFT_Enable: ElementRef;
  @ViewChild('ImagesTFTDisable', { static: false }) Images_TFT_Disable: ElementRef;
  @ViewChild('imageTFT', { static: false }) image_Container_TFT: ElementRef;
  @ViewChild('ImagesREFEnable', { static: false }) Images_REF_Enable: ElementRef;
  @ViewChild('ImagesREFDisable', { static: false }) Images_REF_Disable: ElementRef;
  @ViewChild('imageREF', { static: false }) image_Container_REF: ElementRef;
  @ViewChild('Mode_Switch_State', { static: false }) ModeSwitch: ElementRef;
  @ViewChild('BJ_Switch_State', { static: false }) BJSwitch: ElementRef;
  ROCShown: boolean = false; 
  TFTShown: boolean = false; 
  REFShown: boolean = false; 
  Mode_Switch_State: boolean = true;
  BJ_Switch_State: boolean = true;

  constructor(
    private router: Router,
    private electronService: ElectronService
    ) { }

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
      case 'image_Container_ROC':
        if (!this.ROCShown) {  
          this.Images_ROC_Disable.nativeElement.style.display = 'none';
          this.Images_ROC_Enable.nativeElement.style.display = 'block';
        }
        break;
      case 'image_Container_TFT':
        if (!this.TFTShown) {  
          this.Images_TFT_Disable.nativeElement.style.display = 'none';
          this.Images_TFT_Enable.nativeElement.style.display = 'block';
        }
        break;
      case 'image_Container_REF':
        if (!this.REFShown) {  
          this.Images_REF_Disable.nativeElement.style.display = 'none';
          this.Images_REF_Enable.nativeElement.style.display = 'block';
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
      case 'image_Container_ROC':
        if (!this.ROCShown) {  
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
        }
      break;
      case 'image_Container_TFT':
        if (!this.TFTShown) {  
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
        }
      break;
      case 'image_Container_REF':
        if (!this.REFShown) {  
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
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
      case 'image_Container_ROC':
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
        } else {
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
        }
        this.ROCShown = !this.ROCShown;
        break;
      case 'image_Container_TFT':
        if (!this.TFTShown) {  
          let modeState = this.Mode_Switch_State ? '-folder' : '-map';
          let bjState = this.BJ_Switch_State ? '' : '-noc';
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Disable.nativeElement.style.display = 'none';
          this.Images_TFT_Enable.nativeElement.style.display = 'block';
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
        } else {
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
        }
        this.TFTShown = !this.TFTShown;
        break;
      case 'image_Container_REF':
        if (!this.REFShown) {  
          let modeState = this.Mode_Switch_State ? '-folder' : '-map';
          let bjState = this.BJ_Switch_State ? '' : '-noc';
          this.Images_ROC_Disable.nativeElement.style.display = 'block';
          this.Images_ROC_Enable.nativeElement.style.display = 'none';
          this.Images_TFT_Disable.nativeElement.style.display = 'block';
          this.Images_TFT_Enable.nativeElement.style.display = 'none';
          this.Images_REF_Disable.nativeElement.style.display = 'none';
          this.Images_REF_Enable.nativeElement.style.display = 'block';
        } else {
          this.Images_REF_Disable.nativeElement.style.display = 'block';
          this.Images_REF_Enable.nativeElement.style.display = 'none';
        }
        this.REFShown = !this.REFShown;
      case 'Mode_Switch':
        this.Mode_Switch_State = !this.Mode_Switch_State; 
      case 'BJ_Switch':
        this.BJ_Switch_State = !this.BJ_Switch_State; 
      default:
        console.log('Mouse click an element');
        break;
  }
  }


}






