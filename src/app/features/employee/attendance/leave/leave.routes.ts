import { Routes } from '@angular/router';

export const LEAVE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'leave-form',
    pathMatch: 'full'
  },
  {
    path: 'leave-form',
    children: []  // no component — parent's own template shows the Leave Form UI directly
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./History/history.component').then(m => m.HistoryComponent)
  }
];