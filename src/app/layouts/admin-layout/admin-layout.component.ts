// src/app/layouts/admin-layout/admin-layout.component.ts

import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AdminSidebarComponent } from './components/sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './components/header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

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

    if (url.includes('/admin/dashboard/wall-activity')) {
      this.pageTitle = 'Wallposts';
    }
    else if (url.includes('/admin/dashboard')) {
      this.pageTitle = 'Dashboard';
    }
    else if (url.includes('/admin/employees')) {
      this.pageTitle = 'Employees';
    }
    else if (url.includes('/admin/payrun')) {
      this.pageTitle = 'Payrun';
    }
    else if (url.includes('/admin/attendance')) {
      this.pageTitle = 'Attendance';
    }
    else if (url.includes('/admin/loan')) {
      this.pageTitle = 'Loan & Advance';
    }
    else if (url.includes('/admin/reports')) {
      this.pageTitle = 'Reports';
    }
    else if (url.includes('/admin/setup')) {
      this.pageTitle = 'Setup';
    }
    else if (url.includes('/admin/hrms-portal')) {
      this.pageTitle = 'HRMS Portal';
    }
  }
}