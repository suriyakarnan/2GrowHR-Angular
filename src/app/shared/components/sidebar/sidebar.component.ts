import { Component } from '@angular/core';
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

  employeeSubmenu = [
    { label: 'Employee Directory', path: '/employees/directory' },
    { label: 'Resigned/Deactivated List', path: '/employees/resigned-deactivated' },
    { label: 'OnBoarding', path: '/employees/onboarding' },
    { label: 'Resignation Status', path: '/employees/resignation-status' },
    { label: 'Organization Tree', path: '/employees/organization-tree' },
    { label: 'Exit Process', path: '/employees/exit-process' },
    { label: 'Full & Final Settlement', path: '/employees/full-final-settlement' }
  ];

}