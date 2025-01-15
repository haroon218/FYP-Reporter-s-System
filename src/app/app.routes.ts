import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
    // canActivate: [authGuard]
  },
];
