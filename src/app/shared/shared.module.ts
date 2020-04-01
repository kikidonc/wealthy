import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { AlertComponent } from './alert/alert.component';


const components = [
  ShellComponent,
  AlertComponent,
  BootstrapComponent
];

const modules = [
  CommonModule,
  RouterModule
];

@NgModule({
  declarations: [ShellComponent, BootstrapComponent, AlertComponent],
  imports: [...modules],
  exports: [
    ...components,
    ...modules,
  ]
})
export class SharedModule { }
