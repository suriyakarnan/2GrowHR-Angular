import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-sidebar.component.html',
  styleUrl: './employee-sidebar.component.css'
})
export class EmployeeSidebarComponent {

  menus = [];
  showEmployeesMenu = false;
  isMobileMenuOpen = false;
  isMobile = false;
  flyoutTop = 0; // NEW: tracks vertical screen position for the flyout

  // AFTER
employeeSubmenu = [
  { label: 'Leave', path: '/employee/attendance/attendance' },
  { label: 'General Attendance Summary', path: '/employee/attendance/general-attendance-summary' },
  { label: 'Shift Mapping', path: '/employee/attendance/shift-mapping' },
  { label: 'Day Count Attendance Summary', path: '/employee/attendance/daycount-attendance-summary' },
  { label: 'Detailed Attendance Summary', path: '/employee/attendance/detailed-attendance-summary' }
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

  // CHANGED: now takes the MouseEvent to read the trigger's real screen position
  onMenuMouseEnter(event: MouseEvent) {
    if (!this.isMobile) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.flyoutTop = rect.top; // align flyout's top edge with the hovered row
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