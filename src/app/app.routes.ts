import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PaysComponent } from './pages/pays/pays';
import { EntrepotComponent } from './pages/entrepot/entrepot';
import { LotsComponent } from './pages/lots/lots';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pays/:code', component: PaysComponent },
  { path: 'pays', component: PaysComponent },
  { path: 'entrepot', component: EntrepotComponent },
  { path: 'lots', component: LotsComponent },
  { path: '**', redirectTo: 'welcome' }
];
