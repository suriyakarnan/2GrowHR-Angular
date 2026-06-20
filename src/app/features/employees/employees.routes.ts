import { Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      { path: '', redirectTo: 'directory', pathMatch: 'full' },
      {
        path: 'directory',
        loadComponent: () =>
          import('./employee-directory/employee-directory.component').then(m => m.EmployeeDirectoryComponent)
      },
      
      {
        path: 'resigned-deactivated',
        loadComponent: () =>
          import('./resigned-deactivated-list/resigned-deactivated-list.component').then(m => m.ResignedDeactivatedListComponent),
        loadChildren: () =>
          import('./resigned-deactivated-list/resigned-deactivated-list.routes').then(m => m.RESIGNED_DEACTIVATED_LIST_ROUTES)
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: 'resignation-status',
        loadComponent: () =>
          import('./resignation-status/resignation-status.component').then(m => m.ResignationStatusComponent)
      },
      {
        path: 'organization-tree',
        loadComponent: () =>
          import('./organization-tree/organization-tree.component').then(m => m.OrganizationTreeComponent)
      },
      {
        path: 'exit-process',
        loadComponent: () =>
          import('./exit-process/exit-process.component').then(m => m.ExitProcessComponent)
      },
      {
        path: 'full-final-settlement',
        loadComponent: () =>
          import('./full-final-settlement/full-final-settlement.component').then(m => m.FullFinalSettlementComponent)
      }
    ]
  }, 
  {
        path: 'directory/add',
        loadComponent: () =>
          import('./employee-directory/add-employee/add-employee.component').then(m => m.AddEmployeeComponent)
      }
];