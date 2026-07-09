// src/app/layouts/admin-layout/components/header/admin-header.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {

  @Input() title: string = '';

  isActionsOpen = false;

  toggleActions(): void {
    this.isActionsOpen = !this.isActionsOpen;
  }

  constructor(private router: Router) {}

  // Edit Button Click → Wall Activity Page
  goToWallActivity() {
    this.router.navigate(['/admin/dashboard/wall-activity']);
  }

}