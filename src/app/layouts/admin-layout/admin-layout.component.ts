// layouts/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from './components/header/admin-header.component';
import { AdminSidebarComponent } from './components/sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
// admin-layout.component.ts
export class AdminLayoutComponent {
  pageTitle = 'Dashboard';

  onRouteActivate(component: any) {
    // if the loaded page component exposes a pageTitle property, use it
    this.pageTitle = component.pageTitle ?? 'Dashboard';
  }
}