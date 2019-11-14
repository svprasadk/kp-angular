import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { MaterialModulesModule } from '../../shared/material-modules/material-modules.module';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductsService } from 'services/products.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { AboutusService } from 'services/aboutus.service';
import { AboutusComponent } from './aboutus/aboutus.component';

const aboutRoutes: Routes = [
  {
    path: '',
    component: AboutusComponent,

  }, {
    path: 'add',
    component: AboutComponent,
  }, {
    path: 'edit/:id',
    component: AboutComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    QuillModule,
    MaterialModulesModule,
    RouterModule.forChild(aboutRoutes),
    HttpClientModule,
    FormsModule,

  ],
  declarations: [AboutComponent, AboutusComponent],
  providers: []
})
export class AboutModule { }
