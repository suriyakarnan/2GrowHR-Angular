
import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';

import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

import { AttendanceComponent } from './features/attendance/attendance/attendance.component';

import { PayrunComponent } from './features/payrun/payrun/payrun.component';

import { LoanComponent } from './features/loan/loan/loan.component';

import { ReportsComponent } from './features/reports/reports/reports.component';

import { SetupComponent } from './features/setup/setup/setup.component';

import { HrmsPortalComponent } from './features/hrms-portal/hrms-portal/hrms-portal.component';

import { LayoutComponent } from './shared/components/layout/layout.component';

import { AuthGuard } from './core/guards/auth.guard';



export const routes: Routes = [

  {
    path:'',
    component:LoginComponent, pathMatch: 'full' 
  },

  {
    path:'',
    component:LayoutComponent,

    canActivate:[AuthGuard],

    children:[

      {
        path:'dashboard',
        component:DashboardComponent
      },
      
      {
        path: 'employees',
        loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },
      

      {
        path:'attendance',
        component:AttendanceComponent
      },

      {
        path:'payrun',
        component:PayrunComponent
      },

      {
        path:'loan',
        component:LoanComponent
      },

      {
        path:'reports',
        component:ReportsComponent
      },

      {
        path:'setup',
        component:SetupComponent
      },

      {
        path:'hrms-portal',
        component:HrmsPortalComponent
      }

    ]

  },

  {
    path:'**',
    redirectTo:''
  }

];