import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  constructor() { }
  

  public changeEnabledHomeState(state: boolean) {
      this.isInteractive = state;
  }
}
