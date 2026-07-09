import { Routes } from '@angular/router';


export const Full_Final_Settlement_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'full-final-settlement',
    pathMatch: 'full'
  },
  {
    path: 'full-final-settlement',
    children: []  // no component — parent's own template shows the Overview UI via *ngIf
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./History/history.component').then(m => m.HistoryComponent)
  }
];