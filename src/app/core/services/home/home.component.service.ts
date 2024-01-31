import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  constructor() { }
  
  // 安装判断，设置交互
  @HostBinding('disabled') isInteractive = false;

  public changeEnabledHomeState(state: boolean) {
    if(this.electronService.isElectron) { 
      this.isInteractive = state;
    }
  }
}
