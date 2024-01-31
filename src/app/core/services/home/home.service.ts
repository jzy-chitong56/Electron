import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private enableHomeState = true;

  constructor(
    private electronService: ElectronService
  ) { }
  public changeEnabledHomeState(state: boolean) {
    this.enableHomeState = state;
    return this.enableHomeState;
  }

}
