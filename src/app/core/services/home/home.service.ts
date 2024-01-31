import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  constructor() { }
  

  public changeEnabledHomeState(state: boolean) {
    if(this.electronService.isElectron) { 
      this.isInteractive = state;
    }
  }
}
