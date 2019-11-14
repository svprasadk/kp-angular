import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesPersonComponent } from './sales-person.component';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModulesModule } from 'shared/material-modules/material-modules.module';
import { SharedModule } from 'shared/shared.module';
import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
// import { ProfileModule } from '../admin-dashboard/profile/profile.module';

// ProfileModule

const routes: Routes = [
  // { path: '', redirectTo: 'admin-dashboard', pathMatch: "full" },
  {
    path: '', component: SalesPersonComponent, children: [
      // { path: 'dashboard', loadChildren: "../dashboard/dashboard.module#DashboardModule" },
      { path: '', redirectTo: 'home', pathMatch: "full" },
      { path: 'home', loadChildren: "../home/home.module#HomeModule" },
      { path: 'testimonials', loadChildren: "../awards/awards.module#AwardsModule" },
      { path: 'products', loadChildren: "../admin-dashboard/products/products.module#ProductsModule" },
      { path: 'profile/:id', loadChildren: "../admin-dashboard/profile/profile.module#ProfileModule" },
      { path: 'asktheexpert', loadChildren: "./../asktheexpert/asktheexpert.module#AsktheExpertModule" },
      { path: 'feedback', loadChildren: "./../feedback/feedback.module#feedbackModule" }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    MaterialModulesModule,
    SharedModule,
    // ProfileModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SalesPersonComponent
  ],
  providers: [AuthGuardService, AuthService]
})
export class SalesPersonModule { }
