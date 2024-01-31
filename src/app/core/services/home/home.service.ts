import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private _disableHomeState = false;

  constructor() { }
  public changeEnabledHomeState(state: boolean) {
    this._disableHomeState = state;
    return this._disableHomeState;
  }
}
