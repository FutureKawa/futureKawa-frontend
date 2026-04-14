import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PaysComponent } from './pages/pays/pays';
import { EntrepotComponent } from './pages/pays/entrepot/entrepot';
import { LotsComponent } from './pages/lots/lots';
import { Inventory } from './pages/inventory/inventory';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pays/:paysId/entrepot/:entrepotId', component: EntrepotComponent },
  { path: 'pays/:code', component: PaysComponent },
  { path: 'pays', component: PaysComponent },
  { path: 'inventory', component: Inventory },
  { path: 'entrepot', component: EntrepotComponent },
  { path: 'lots', component: LotsComponent },
  { path: '**', redirectTo: 'welcome' }
];
