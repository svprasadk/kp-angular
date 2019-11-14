import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

// import { AuthenticationService } from '../../services/categories.service';
import { PopupService } from '../../services/popup.service';
import { LoadingbarService } from '../../services/loading-bar.service';
import { AuthenticationService } from 'services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public dynamicWindowHeight;
  public loginForm: FormGroup
  hide = true;
  public errorMessage: any;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@hil\.[a-z]{2,3}$")]],

    })
  }


  getErrorMessage() {
    return this.loginForm.get('email').hasError('required') ? 'You must enter a value' :
      this.loginForm.get('email').hasError('pattern') ? 'Not a valid email' :
        // this.loginForm.get('password').hasError('required') ? 'You must enter a value':
        '';

  }

  loginSubmit() {
    console.log(this.loginForm.value);
    this.loginForm.value.email = this.loginForm.value.email.toLowerCase();
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.authenticationService.forgotPassword(this.loginForm.value)
        .subscribe(
          (response) => {
            console.log("forgotpassword", response)
            if (response.status == true) {
              this.router.navigate(['/login/recovery-email'])
              setTimeout(() => {
                this.router.navigate(['/']);
            }, 5000);
            }

          }, err => {
            console.log(err);

          })
    }
  }





}
