import { Routes } from '@angular/router';

export const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];
