// src/app/features/admin/dashboard/dashboard.routes.ts

import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'wall-activity',               // ← child route
    loadComponent: () =>
      import('./wall-activity/wall-activity.component')
        .then(m => m.WallActivityComponent)
  }
];