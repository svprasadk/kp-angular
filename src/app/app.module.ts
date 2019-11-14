import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModulesModule } from './shared/material-modules/material-modules.module';
import { LoadingbarService } from './services/loading-bar.service';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
// import { AuthenticationModule } from './authentication/authentication.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { LoginActivate } from './login-guard.service';
// import { UsersComponent } from './users/users.component';
import { UsersService } from 'services/users.service';
import { SharedModule } from 'shared/shared.module';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'login', loadChildren: "./authentication/authentication.module#AuthenticationModule",
        canActivate: [LoginActivate]
      },

      {
        path: 'admin', loadChildren: "./admin-dashboard/admin-dashboard.module#AdminDashboardModule",
        canActivate: [AuthGuardService],
        data: { roles: ['admin'] }
      },
      {
        path: 'user', loadChildren: "./sales-person/sales-person.module#SalesPersonModule",
        canActivate: [AuthGuardService],
        data: { roles: ['user'] }
      },
      { path: '', redirectTo: 'user', pathMatch: "full" },


    ]
  },
];
@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModulesModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [LoadingbarService,
    AuthService,
    AuthGuardService,
    LoginActivate,
    UsersService

  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
