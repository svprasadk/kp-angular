import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModulesModule } from 'shared/material-modules/material-modules.module';
import { SharedModule } from 'shared/shared.module';

import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthGuardService } from '../../auth-guard.service';
import { AuthService } from '../../auth.service';




const profileRoutes: Routes = [
  // { path: '', redirectTo: 'admin-dashboard', pathMatch: "full" },
  {
    path: '', component: ProfileComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    MaterialModulesModule,
    SharedModule,
    HttpModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(profileRoutes)
  ],
  declarations: [
   ProfileComponent,
  ],
  providers: [AuthGuardService, AuthService]
})
export class ProfileModule { }
