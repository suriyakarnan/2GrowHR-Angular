// src/app/layouts/employee-layout/employee-layout.component.ts

import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { EmployeeSidebarComponent } from './components/sidebar/employee-sidebar.component';
import { EmployeeHeaderComponent } from './components/header/employee-header.component';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    EmployeeSidebarComponent,
    EmployeeHeaderComponent
  ],
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.css']
})
export class EmployeeLayoutComponent {

  pageTitle = 'Dashboard';

  constructor(private router: Router) {

    this.setTitle(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitle(this.router.url);
      });
  }

  private setTitle(url: string): void {

    if (url.includes('/employee/dashboard')) {
      this.pageTitle = 'Dashboard';
    }
    else if (url.includes('/employee/profile')) {
      this.pageTitle = 'Profile';
    }
    else if (url.includes('/employee/attendance')) {
      this.pageTitle = 'Attendance';
    }
    else if (url.includes('/employee/finance')) {
      this.pageTitle = 'Finance';
    }
    else if (url.includes('/employee/reports')) {
      this.pageTitle = 'Reports';
    }
    else if (url.includes('/employee/task')) {
      this.pageTitle = 'Task';
    }
  }
}