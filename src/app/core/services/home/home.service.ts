import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private enableHomeState = new BehaviorSubject<boolean>(false);

  constructor() { }
  public changeEnabledHomeState(state: boolean) {
    this.enableHomeState.next(state);
  }

  get isInteractive() {
    return this.enableHomeState.asObservable();
  }
}
