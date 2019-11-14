import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MaterialModulesModule } from 'shared/material-modules/material-modules.module';
import { SharedModule } from 'shared/shared.module';
import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  // { path: '', redirectTo: 'admin-dashboard', pathMatch: "full" },
  {
    path: '', component: AdminDashboardComponent, children: [


      // { path: 'dashboard', loadChildren: "../dashboard/dashboard.module#DashboardModule" },
      { path: '', redirectTo: 'categories', pathMatch: "full" },
      // { path: 'home', loadChildren: "../home/home.module#HomeModule" },
      // { path: 'awards', loadChildren: "../awards/awards.module#AwardsModule" },

      { path: 'categories', loadChildren: "../categories/categories.module#CategoriesModule" },
      { path: 'products', loadChildren: "./products/products.module#ProductsModule" },
      {
        path: 'users', loadChildren: "../users/users.module#UsersModule",
        canActivate: [AuthGuardService],
        data: { roles: ['admin', 'user'] }
      }, {
        path: 'profile/:id', loadChildren: './profile/profile.module#ProfileModule'
      }, {
        path: 'about', loadChildren: './about/about.module#AboutModule'
      }
    ]
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
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminDashboardComponent,
    NavbarComponent,
    SideNavComponent,
  ],
  providers: [AuthGuardService, AuthService]
})
export class AdminDashboardModule { }
