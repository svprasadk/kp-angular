import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';
@Injectable()

export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private location: Location) {
        console.log('no token.................');
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {


        if (this.authService.isAuthenticated()) {
            console.log('authguard....................', this.authService.isAuthenticated());

            const expectedRole = route.data.roles;
            const role = localStorage.getItem('role');
            if (expectedRole.indexOf(role) >= 0) {
                return true;

            } else {
                if(localStorage.getItem('role')==="admin"){
                    this.router.navigate(['/admin/categories'])

                }
if(localStorage.getItem('role')==="user"){
    this.router.navigate(['/user/home'])

}
                return false;

            }


        } else {
            console.log('no token.................');
            this.router.navigate(['/login'])
            return false
        }

    }

    logActivate() {
        console.log(this.location.path())

    }



}
