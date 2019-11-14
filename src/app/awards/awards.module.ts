import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardsComponent } from './awards.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '', component: AwardsComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AwardsComponent]
})
export class AwardsModule { }
