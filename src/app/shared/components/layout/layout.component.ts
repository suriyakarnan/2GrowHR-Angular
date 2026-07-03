import { Component } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  pageTitle = 'Dashboard';

  constructor(private router: Router) {

    this.setTitle(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        this.setTitle(this.router.url);

      });
  }

  private setTitle(url: string): void {

    // ✅ Specific route (wall-activity) MUDHAL-LA check pannunga
    if (url.includes('/dashboard/wall-activity')) {
      this.pageTitle = "Wallposts";
    }

    // General route apparam check pannunga
    else if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    }

    else if (url.includes('/employees')) {
      this.pageTitle = 'Employees';
    }

    else if (url.includes('/payrun')) {
      this.pageTitle = 'Payrun';
    }

    else if (url.includes('/attendance')) {
      this.pageTitle = 'Attendance';
    }

    else if (url.includes('/loan')) {
      this.pageTitle = 'Loan & Advance';
    }

    else if (url.includes('/reports')) {
      this.pageTitle = 'Reports';
    }

    else if (url.includes('/setup')) {
      this.pageTitle = 'Setup';
    }

    else if (url.includes('/hrms-portal')) {
      this.pageTitle = 'Dashboard';
    }
}
}