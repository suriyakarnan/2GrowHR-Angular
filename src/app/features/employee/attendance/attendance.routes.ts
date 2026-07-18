import { Routes } from '@angular/router';
import { AttendanceComponent } from './attendance.component';

export const ATTENDANCE_ROUTES: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    children: [
      { path: '', redirectTo: 'attendance', pathMatch: 'full' },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./leave/leave.component').then(m => m.LeaveComponent)
      },
      
      {
        path: 'general-attendance-summary',
        loadComponent: () =>
          import('./general-attendance-summary/general-attendance-summary.component').then(m => m.GeneralAttendanceSummaryComponent),
        // loadChildren: () =>
        //   import('').then(m => m.RESIGNED_DEACTIVATED_LIST_ROUTES)
      },
      {
        path: 'shift-mapping',
        loadComponent: () =>
          import('./shift-mapping/shift-mapping.component').then(m => m.ShiftMappingComponent)
      },
      {
        path: 'daycount-attendance-summary',
        loadComponent: () =>
          import('./daycount-attendance-summary/daycount-attendance-summary.component').then(m => m.DaycountAttendanceSummaryComponent)
      },
      {
        path: 'detailed-attendance-summary',
        loadComponent: () =>
          import('./detailed-attendance-summary/detailed-attendance-summary.component').then(m => m.DetailedAttendanceSummaryComponent)
      }
    ]
  },
//   {
//         path: 'directory/add',
//         loadComponent: () =>
//           import('./employee-directory/add-employee/add-employee.component').then(m => m.AddEmployeeComponent)
//       }
];