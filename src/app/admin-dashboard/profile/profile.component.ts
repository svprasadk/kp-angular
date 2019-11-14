import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'services/users.service';
import { LoadingbarService } from 'services/loading-bar.service';
import { PopupService } from 'services/popup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private usersService: UsersService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private fb: FormBuilder, ) { }
  id: String;
  hide: boolean = true;
  hide2: boolean = true;
  public userForm: FormGroup;
  public passwordForm: FormGroup;
  passwordsMatcher = new RepeatPasswordEStateMatcher;
  password: String;
  employeeId: String;
  ngOnInit() {
    this.route.params.subscribe(params => {

      this.id = params['id'];
      console.log("iddddd", this.id, params);
      this.formUpdate();

      this.usersService.getUser(this.id)
        .subscribe(
          (response) => {
            console.log(response);
            this.password = response.data.password;
            this.employeeId = response.data.employeeId;
            this.userForm.patchValue(response.data);

          }, err => {
            console.log(err);
          })

    })
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  formUpdate() {
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@hil\.[a-z]{2,3}$")]],
      // password: [null, [Validators.required, Validators.minLength(8),
      // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10),
      Validators.required, Validators.maxLength(13)]],
      // employeeId: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],


    })

    this.passwordForm = this.fb.group({
      currentPassword: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],
      password: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],
      confirmPassword: [null, [Validators.required]]
    }, { validator: this.RepeatPasswordValidator })
  }


  RepeatPasswordValidator(group: FormGroup) {
    let password = group.controls.password.value;
    let passwordConfirmation = group.controls.confirmPassword.value;

    return password === passwordConfirmation ? null : { passwordsNotEqual: true }
  }
  getErrorMessage(formcontrolname) {
    // console.log('validation called')
    if (formcontrolname == 'email') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a email' :
        this.userForm.get(formcontrolname).hasError('pattern') ? 'Not a valid email' :
          '';
    }
    // if (formcontrolname == 'employeeId') {
    //   return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a employeeId' :
    //     '';
    // }
    if (formcontrolname == 'lastName') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a lastName' :
        '';
    }
    if (formcontrolname == 'firstName') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a firstName' :
        '';
    }
    // if (formcontrolname == 'password') {
    //   return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a password' :
    //     this.userForm.get(formcontrolname).hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
    //       this.userForm.get(formcontrolname).hasError('minlength') ? 'password must be 8 characters' :
    //         '';
    // }
    if (formcontrolname == 'phoneNumber') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a phoneNumber' :
        this.userForm.get(formcontrolname).hasError('minlength') ? 'phonenumber must be 10 numbers' :
          this.userForm.get(formcontrolname).hasError('maxlength') ? 'phonenumber must be 10 characters' :

            '';
    }

  }
  addUser() {
    var data: any = this.userForm.value;
    data.password = this.password;
    data.employeeId = this.employeeId;
    data.id = this.id;
    this.usersService.updateUser(data)
      .subscribe(
        (response) => {
          console.log("userrr", response)
          if (response.status == true) {
            // this.router.navigate(['admin/users/update'])
            this.popupService.show('Successfully updated data');
            this.ngOnInit()

          }
        }, err => {
          console.log(err);
          this.popupService.showServerError(err.error.message)
        })
  }
  passwordErrorGet(formcontrolname) {
    if (formcontrolname == 'password') {
      return this.passwordForm.get(formcontrolname).hasError('required') ? 'You must enter a password' :
        this.passwordForm.get(formcontrolname).hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
          this.passwordForm.get(formcontrolname).hasError('minlength') ? 'password must be 8 characters' :
            '';
    }
    if (formcontrolname == 'currentPassword') {
      return this.passwordForm.get(formcontrolname).hasError('required') ? 'You must enter a password' :
        this.passwordForm.get(formcontrolname).hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
          this.passwordForm.get(formcontrolname).hasError('minlength') ? 'password must be 8 characters' :
            '';
    }
    // if (formcontrolname == 'confirmPassword') {
    //   return this.passwordForm.get(formcontrolname).hasError('passwordsNotEqual') ? 'Passwords are different. They should be equal!' : '';
    // }
  }
  changePassword() {
    console.log(this.passwordForm.valid)
    var data: any = this.passwordForm.value;
    data.id = this.id;

    this.usersService.changePassword(data).subscribe((res: any) => {
      console.log(res);
      this.popupService.show('Password Reset Successfull');
      this.ngOnInit()
    }, (err: any) => {
      console.log(err);
      this.popupService.showServerError(err.error.message)

    })
  }
}

import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
export class RepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('password').value !== control.parent.get('confirmPassword').value && control.dirty)
  }
}