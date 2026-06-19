import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // SIDEBAR STATUS
  private sidebarStatus =
  new BehaviorSubject<boolean>(true);

  sidebarState =
  this.sidebarStatus.asObservable();

  constructor() { }

  // TOGGLE SIDEBAR
  toggleSidebar(){

    this.sidebarStatus.next(
      !this.sidebarStatus.value
    );

  }

}