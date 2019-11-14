import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModulesModule } from '../shared/material-modules/material-modules.module';
import { SharedModule } from '../shared/shared.module';
import { PopupService } from '../services/popup.service';
import { LoadingbarService } from '../services/loading-bar.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { UsersService } from '../services/users.service';
import { AddSuccessComponent } from './add-success/add-success.component';


const routes: Routes = [
  // { path: '', redirectTo: "dashboard", pathMatch: "full" },
  { path: '', component: UsersComponent },
  { path: 'add', component: AddUsersComponent },
  { path: 'edit/:id', component: AddUsersComponent },
  { path: 'success', component: AddSuccessComponent },
  { path: 'update', component: AddSuccessComponent },
  { path: 'users-added', component: AddSuccessComponent }
]



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(routes),
    MaterialModulesModule,

  ],
  exports: [RouterModule],
  declarations: [AddUsersComponent, UsersComponent, AddSuccessComponent],
  providers: [PopupService, LoadingbarService],
})
export class UsersModule { }
