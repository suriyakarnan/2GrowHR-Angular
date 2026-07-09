// src/app/layouts/admin-layout/components/sidebar/admin-sidebar.component.ts

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  menus = [];

  showEmployeesMenu = false;
  isMobileMenuOpen = false;
  isMobile = false;

  employeeSubmenu = [
    { label: 'Employee Directory', path: '/admin/employees/directory' },
    { label: 'Resigned/Deactivated List', path: '/admin/employees/resigned-deactivated' },
    { label: 'OnBoarding', path: '/admin/employees/onboarding' },
    { label: 'Resignation Status', path: '/admin/employees/resignation-status' },
    { label: 'Organization Tree', path: '/admin/employees/organization-tree' },
    { label: 'Exit Process', path: '/admin/employees/exit-process' },
    { label: 'Full & Final Settlement', path: '/admin/employees/full-final-settlement' }
  ];

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 1024;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    } else {
      this.showEmployeesMenu = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.showEmployeesMenu = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    if (this.isMobile) {
      this.showEmployeesMenu = false;
    }
  }

  onSubmenuLinkClick() {
    this.closeMobileMenu();
  }

  onMenuMouseEnter() {
    if (!this.isMobile) {
      this.showEmployeesMenu = true;
    }
  }

  onMenuMouseLeave() {
    if (!this.isMobile) {
      this.showEmployeesMenu = false;
    }
  }

  onEmployeesLinkClick(event: Event) {
    if (this.isMobile) {
      event.preventDefault();
      this.showEmployeesMenu = !this.showEmployeesMenu;
    }
  }

}