import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { PopupService } from '../services/popup.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from '../services/http-interceptor.service';
import { HttpModule } from '@angular/http';
import { CategoriesService } from '../services/categories.service';
import { AboutusService } from 'services/aboutus.service';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule
  ],
  declarations: [ConfirmationPopupComponent, ScrollTopComponent],
  exports: [ConfirmationPopupComponent, ScrollTopComponent],
  entryComponents: [ConfirmationPopupComponent, ScrollTopComponent],
  providers: [
    PopupService,
    AboutusService,
    CategoriesService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class SharedModule { }
