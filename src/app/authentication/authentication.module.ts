import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModulesModule } from '../shared/material-modules/material-modules.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { CategoriesService } from '../services/categories.service';
import { PopupService } from '../services/popup.service';
import { LoadingbarService } from '../services/loading-bar.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationComponent } from './authentication.component';
import { RecoveryEmailComponent } from './recovery-email/recovery-email.component';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  // { path: '', redirectTo: 'admin-dashboard', pathMatch: "full" },
  { path: '', component: LoginComponent },
  { path: 'forgot-password' , component : ForgotPasswordComponent},
  { path: 'reset-password/:id' , component: ResetPasswordComponent},
  { path: 'recovery-email',component:RecoveryEmailComponent}

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModulesModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    // BrowserModule,
    FormsModule,

  ],
  declarations: [LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, AuthenticationComponent, RecoveryEmailComponent],
  providers: [CategoriesService,PopupService,LoadingbarService,AuthenticationService],

})
export class AuthenticationModule { }
