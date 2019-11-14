import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAttributesComponent } from './add-attributes/add-attributes.component';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'shared/shared.module';
import { MaterialModulesModule } from 'shared/material-modules/material-modules.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
// import { ProductAttributeService } from 'services/product-attributes.service';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';


const attributeRoutes: Routes = [
  {
    path: ':id',
    component: AddAttributesComponent,

  },
  {
    path: ':id/:headingId',
    component: AddAttributesComponent,

  }

];
@NgModule({
  imports: [
    CommonModule,
    MaterialModulesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(attributeRoutes),
    QuillModule,
    HttpClientModule,
    PdfViewerModule,


  ],
  declarations: [AddAttributesComponent],
  providers: []
})
export class AttributesModule { }
