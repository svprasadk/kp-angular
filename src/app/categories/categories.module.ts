import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { AddCategorieComponent } from './add-categorie/add-categorie.component';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../services/popup.service';
import { LoadingbarService } from '../services/loading-bar.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AddSuccessComponent } from './add-success/add-success.component';
import { MaterialModulesModule } from '../shared/material-modules/material-modules.module';
import { AuthService } from '../auth.service';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  // { path: '', redirectTo: "dashboard", pathMatch: "full" },
  {
    path: '', component: CategoriesComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'add', component: AddCategorieComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'success', component: AddSuccessComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'edit/:id', component: AddCategorieComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'updated', component: AddSuccessComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  }
]



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(routes),
    MaterialModulesModule
  ],
  exports: [RouterModule],
  declarations: [
    CategoriesComponent,
    AddCategorieComponent,
    AddSuccessComponent

  ],
  providers: [ PopupService, LoadingbarService, AuthGuardService, AuthService
  ],
})
export class CategoriesModule { }
