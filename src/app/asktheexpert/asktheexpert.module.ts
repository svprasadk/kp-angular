import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './../authentication/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModulesModule } from '../shared/material-modules/material-modules.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PopupService } from '../services/popup.service';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationComponent } from './../authentication/authentication.component';
import { AsktheexpertComponent } from './asktheexpert.component';

const routes: Routes = [
  { path: '', component: AsktheexpertComponent, }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModulesModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [ AsktheexpertComponent],
  providers: [PopupService, AuthenticationService],

})
export class AsktheExpertModule { }

