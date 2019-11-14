import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'shared/shared.module';


const routes: Routes = [
  // { path: '', redirectTo: 'admin-dashboard', pathMatch: "full" },
  {
    path: '', component: HomeComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
