
import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize, map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import 'rxjs/add/observable/throw';
import { LoadingbarService } from "services/loading-bar.service";


@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private loadingbarService: LoadingbarService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("requestlllllllllllllllllllllllllllllllllllllllllllllllllllll");
        this.loadingbarService.show();

        if (localStorage.getItem('token')) {
            var headers = {}
            request = request.clone({
                setHeaders: {
                    'x-access-token': localStorage.getItem('token'),
                    Authorization: localStorage.getItem('token')
                }
            })
            // return next.handle(request);
            return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.loadingbarService.hide();
                }
            },
                (err: any) => {
                    this.loadingbarService.hide();

                }));
        }
        else {
            // console.log('interceptor.........')
            return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.loadingbarService.hide();
                }
            },
                (err: any) => {
                    this.loadingbarService.hide();

                }));
        }

    }
}