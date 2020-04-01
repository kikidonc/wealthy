import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { AssetsComponent } from './assets/assets.component';
import { AddAssetComponent } from './add-asset/add-asset.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { StocksComponent } from './stocks/stocks.component';

const components = [
  HomeComponent,
  LoginComponent,
  ProfileComponent,
  AssetsComponent,
  AddAssetComponent,
  DashboardComponent
];

const modules = [
  CommonModule,
  SharedModule,
  ReactiveFormsModule,
  NgxChartsModule
];

@NgModule({
  declarations: [...components, PortfolioComponent, StocksComponent],
  imports: [...modules],
  exports: [
    HomeComponent,
    LoginComponent
  ]
})
export class ViewsModule { }
