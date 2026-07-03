import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menus = [];

  showEmployeesMenu = false;
  isMobileMenuOpen = false;
  isMobile = false;

  employeeSubmenu = [
    { label: 'Employee Directory', path: '/employees/directory' },
    { label: 'Resigned/Deactivated List', path: '/employees/resigned-deactivated' },
    { label: 'OnBoarding', path: '/employees/onboarding' },
    { label: 'Resignation Status', path: '/employees/resignation-status' },
    { label: 'Organization Tree', path: '/employees/organization-tree' },
    { label: 'Exit Process', path: '/employees/exit-process' },
    { label: 'Full & Final Settlement', path: '/employees/full-final-settlement' }
  ];

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 1024;
    if (!this.isMobile) {
      // reset mobile-only states when switching back to desktop
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
    // close whole drawer on mobile after picking a submenu item
    this.closeMobileMenu();
  }

  // Desktop hover behaviour, untouched on desktop
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

  // On mobile, tapping "Employees" toggles the accordion instead of navigating away immediately
  onEmployeesLinkClick(event: Event) {
    if (this.isMobile) {
      event.preventDefault();
      this.showEmployeesMenu = !this.showEmployeesMenu;
    }
  }

}