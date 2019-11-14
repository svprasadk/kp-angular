import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

import { CategoriesService } from '../../services/categories.service';
import { PopupService } from '../../services/popup.service';
import { LoadingbarService } from '../../services/loading-bar.service';
import { AuthenticationService } from '../../services/authentication.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ViewChild('email') email: any;
  // @ViewChild('password') password: any;

  public dynamicWindowHeight;
  public loginForm: FormGroup
  hide = true;
  public errorMessage: any;
  public token: any;
  public role: any;
  public userRole: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.token = localStorage.getItem('token');
    this.role = localStorage.getItem('role');
    if (this.token) {
      this.router.navigate(['/admin/categories'])
    }

    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@hil\.[a-z]{2,3}$")]],
      password: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],

    })
  }


  getErrorMessage() {
    return this.loginForm.get('email').hasError('required') ? 'You must enter a value' :
      this.loginForm.get('email').hasError('pattern') ? 'Not a valid email' :
        // this.loginForm.get('password').hasError('required') ? 'You must enter a value':
        '';

  }
  getErrorMessage2() {
    return this.loginForm.get('password').hasError('required') ? 'You must enter a value' :
      this.loginForm.get('password').hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
        this.loginForm.get('password').hasError('minlength') ? 'Password must be more than 8 characters' :
          '';
  }





  loginSubmit() {
    console.log(this.loginForm.value);
    this.loginForm.value.email = this.loginForm.value.email.toLowerCase();
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value)
        .subscribe(
          (response) => {
            console.log("loginnnn", response)
            if (response.status == true) {
              if (response.status == true) {
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('id', response.data._id);
                localStorage.setItem('firstName', response.data.firstName);
                if (response.data.role === "user") {
                  this.router.navigate(['/user/home'])
                } else {
                  this.router.navigate(['/admin/categories'])

                }



              }
            }

          }, err => {
            console.log(err.error.message)
            this.popupService.showServerError(err.error.message)
          })

    }
    else {
      this.validateAllFormFields(this.loginForm)
    }
  }
  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  // isFieldValid(){
  //   if(this.loginForm.value.email && this.loginForm.value.password ){
  //     return false
  //   }
  //   else {
  //     return true
  //   }
  // }


}
