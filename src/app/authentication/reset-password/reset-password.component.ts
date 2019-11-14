import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

import { CategoriesService } from '../../services/categories.service';
import { PopupService } from '../../services/popup.service';
import { LoadingbarService } from '../../services/loading-bar.service';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public dynamicWindowHeight;
  public resetPasswordForm: FormGroup
  hide = true;
  isValid: boolean = false;
  public errorMessage: any;
  id: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.id = params['id'];
      console.log("iddddd", this.id, params);
    })

    this.resetPasswordForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],

      confirmPassword: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],

    })
  }


  getErrorMessage() {
    return this.resetPasswordForm.get('newPassword').hasError('required') ? 'You must enter a value' :
      this.resetPasswordForm.get('newPassword').hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
        this.resetPasswordForm.get('newPassword').hasError('minlength') ? 'Password must be more than 8 characters' :
          '';
  }
  getErrorMessage2() {
    return this.resetPasswordForm.get('confirmPassword').hasError('required') ? 'You must enter a value' :
      this.resetPasswordForm.hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
      // this.resetPasswordForm.get('confirmPassword').hasError('minlength') ? 'Password must be more than 8 characters' :
      '';
  }





  loginSubmit() {
    this.isValid = true;
    console.log(this.resetPasswordForm.value);
    // this.resetPasswordForm.value.email = this.resetPasswordForm.value.email.toLowerCase();
    console.log(this.resetPasswordForm.value);

    var data = this.resetPasswordForm.value;

    data['id'] = this.id;
    console.log(data);
    if (this.resetPasswordForm.valid && (this.resetPasswordForm.value.newPassword == this.resetPasswordForm.value.confirmPassword)) {
      this.authenticationService.resetPassword(data)
        .subscribe(
          (response) => {
            console.log("loginnnn", response)
            if (response.status == true) {
              this.popupService.show('Your password has been successfully changed');
              this.router.navigate(['/login']);
            }
          }, err => {
            console.log(err);

          })
      // this.router.navigate(['/admin/categories'])
    }
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
