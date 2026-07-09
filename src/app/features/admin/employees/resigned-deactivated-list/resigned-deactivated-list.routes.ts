import { Routes } from '@angular/router';

export const RESIGNED_DEACTIVATED_LIST_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    children: []  // no component — parent's own template shows the Overview UI via *ngIf
  },
  {
    path: 'detailed-view',
    loadComponent: () =>
      import('./detailed-view/detailed-view.component').then(m => m.DetailedViewComponent)
  }
];