import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private enableHomeState = true;

  constructor() { }
  public changeEnabledHomeState(state: boolean) {
    this.enableHomeState = state;
    return this.enableHomeState;
  }

}
