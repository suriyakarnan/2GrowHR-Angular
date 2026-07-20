import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // ---------- ADMIN ----------
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/admin/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/admin/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'payrun',
        loadChildren: () => import('./features/admin/payrun/payrun.routes').then(m => m.Payrun_ROUTES)
      },
      {
        path: 'loan',
        loadComponent: () => import('./features/admin/loan/loan.component').then(m => m.LoanComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'setup',
        loadComponent: () => import('./features/admin/setup/setup.component').then(m => m.SetupComponent)
      },
      {
        path: 'hrms-portal',
        loadComponent: () => import('./features/admin/hrms-portal/hrms-portal.component').then(m => m.HrmsPortalComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---------- EMPLOYEE ----------
  {
    path: 'employee',
    loadComponent: () => import('./layouts/employee-layout/employee-layout.component').then(m => m.EmployeeLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'employee' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/employee/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/employee/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'attendance',
        loadChildren: () => import('./features/employee/attendance/attendance.routes').then(m => m.ATTENDANCE_ROUTES)
      },
      {
        path: 'finance',
        loadComponent: () => import('./features/employee/finance/finance.component').then(m => m.FinanceComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/employee/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'task',
        loadComponent: () => import('./features/employee/task/task.component').then(m => m.TaskComponent)
      },
      {
        path: 'wall-activity',
        loadComponent: () => import('./features/employee/wall-activity/wall-activity.component').then(m => m.WallActivityComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];