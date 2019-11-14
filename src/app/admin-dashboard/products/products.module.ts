import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { MaterialModulesModule } from '../../shared/material-modules/material-modules.module';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductsService } from 'services/products.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductAttributeService } from 'services/product-attributes.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AuthGuardService } from '../../auth-guard.service';
import { AuthService } from '../../auth.service';


const productRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent,

  },
  {
    path: 'details/:id',
    component: ProductDetailsComponent,

  }, {
    path: 'add',
    component: AddProductComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }

  }, {
    path: 'add/:categoryId',
    component: AddProductComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  }, {
    path: 'edit/:id',
    component: AddProductComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }

  }, {
    path: 'add-attribute',
    loadChildren: './attributes/attributes.module#AttributesModule',
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  }, {

    path: 'edit-attribute',
    loadChildren: './attributes/attributes.module#AttributesModule',
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  }
  , {
    path: ':id',
    component: ProductsComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModulesModule,
    RouterModule.forChild(productRoutes),
    HttpClientModule,
    FormsModule,
    PdfViewerModule
  ],
  declarations: [ProductsComponent, AddProductComponent, ProductDetailsComponent],
  providers: [ProductsService, ProductAttributeService]
})
export class ProductsModule { }
