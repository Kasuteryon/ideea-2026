import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'invitation',
    loadComponent: () =>
      import('./invitation-search/invitation-search').then((m) => m.InvitationSearch),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin-login/admin-login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
];
