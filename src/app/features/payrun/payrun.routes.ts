import { PayrunComponent } from './payrun.component';
import { Routes } from '@angular/router';

export const Payrun_ROUTES: Routes = [
  {
    path: '',
    component: PayrunComponent,          // ← has navbar
    children: [
      { path: '', redirectTo: 'payrun-process', pathMatch: 'full' },
      {
        path: 'payrun-process',
        loadComponent: () =>
          import('./payrun-process/payrun-process.component').then(m => m.PayrunProcessComponent)
      },
      {
        path: 'payslip-auditlog',
        loadComponent: () =>
          import('./payslip-auditlog/payslip-auditlog.component').then(m => m.PayslipAuditlogComponent),
      },
      {
        path: 'processed-payslip',
        loadComponent: () =>
          import('./processed-payslip/processed-payslip.component').then(m => m.ProcessedPayslipComponent)
      },
    ]
  },

  // ✅ Sibling route — no PayrunComponent wrapper, no navbar
  {
    path: 'payrun-process/payrun-attendance',
    loadComponent: () =>
      import('./payrun-process/payrun-attendance/payrun-attendance.component').then(m => m.PayrunAttendanceComponent)
  },
];