import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private _enabledHomeState = false;

  constructor() { }

  public get enabledHomeState(): boolean {
    return this._enabledHomeState;
  }

  public changeEnabledHomeState(state: boolean): boolean {
    this._enabledHomeState = state;
    return this._enabledHomeState;
  }
}
