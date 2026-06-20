import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'payrun',
        loadComponent: () => import('./features/payrun/payrun/payrun.component').then(m => m.PayrunComponent)
      },
      {
        path: 'loan',
        loadComponent: () => import('./features/loan/loan/loan.component').then(m => m.LoanComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'setup',
        loadComponent: () => import('./features/setup/setup/setup.component').then(m => m.SetupComponent)
      },
      {
        path: 'hrms-portal',
        loadComponent: () => import('./features/hrms-portal/hrms-portal/hrms-portal.component').then(m => m.HrmsPortalComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];