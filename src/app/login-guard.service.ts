import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
@Injectable()
export class LoginActivate implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/admin/categories']);
        }
        return true;
    }
}