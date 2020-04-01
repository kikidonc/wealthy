import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Views
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import { AssetsComponent } from './views/assets/assets.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PortfolioComponent } from './views/portfolio/portfolio.component';
import { AuthGuard } from './auth.guard';
import { StocksComponent } from './views/stocks/stocks.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent,  canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard] },
  { path: 'assets', component: AssetsComponent,  canActivate: [AuthGuard] },
  { path: 'stocks', component: StocksComponent,  canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
