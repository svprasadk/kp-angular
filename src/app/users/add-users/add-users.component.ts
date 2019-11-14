import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PopupService } from '../../services/popup.service';
import { LoadingbarService } from '../../services/loading-bar.service';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {
  public userForm: FormGroup;
  hide = true;
  templateFile: any;
  importData: boolean = false;
  id: any;
  routerUrl: any;
  appendStatus: boolean = false;
  replaceStatus: boolean = false;
  validate: boolean = false;
  option: boolean = false;
  usersFormData: any;
  text: any;
  fileupload: any;
  showPassword: boolean = false;
  edit: boolean = false;
  password: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private loadingbarService: LoadingbarService,
    private popupService: PopupService,
    private fb: FormBuilder,
    public dialog: MatDialog) {
    router.events.subscribe((url: any) => console.log());
    // console.log(router.url);
    this.routerUrl = router.url;
  }

  ngOnInit() {
    this.option = true;
    if (this.routerUrl != "/admin/users/add") {
      this.edit = true;
      this.route.params.subscribe(params => {

        this.id = params['id'];
        console.log("iddddd", this.id, params);


        this.usersService.getUser(this.id)
          .subscribe(
            (response) => {
              console.log(response);
              this.userForm.patchValue(response.data);

            }, err => {
              console.log(err);
            })

      })
    }

    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@hil\.[a-z]{2,3}$")]],
      password: [null, [Validators.required, Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%#?&]+$')]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10),
      Validators.required, Validators.maxLength(10)]],
      employeeId: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],


    })
  }

  getErrorMessage(formcontrolname) {
    // console.log('validation called')
    if (formcontrolname == 'email') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a email' :
        this.userForm.get(formcontrolname).hasError('pattern') ? 'Not a valid email' :
          '';
    }
    if (formcontrolname == 'employeeId') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a employeeId' :
        '';
    }
    if (formcontrolname == 'lastName') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a lastName' :
        '';
    }
    if (formcontrolname == 'firstName') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a firstName' :
        '';
    }
    if (formcontrolname == 'password') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a password' :
        this.userForm.get(formcontrolname).hasError('pattern') ? 'Password must contain atleast one uppercase,one lowercase, one number and one special character' :
          this.userForm.get(formcontrolname).hasError('minlength') ? 'password must be 8 characters' :
            '';
    }
    if (formcontrolname == 'phoneNumber') {
      return this.userForm.get(formcontrolname).hasError('required') ? 'You must enter a phoneNumber' :
        this.userForm.get(formcontrolname).hasError('minlength') ? 'phonenumber must be 10 numbers' :
          this.userForm.get(formcontrolname).hasError('maxlength') ? 'phonenumber must be 10 characters' :

            '';
    }

  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addUser() {
    if (this.importData == true || (this.replaceStatus == false && this.appendStatus == false)) {
      if (!this.templateFile)
        this.validate = true;
      if (this.replaceStatus == false && this.appendStatus == false)
        this.option = false;
    }
    if (this.userForm.valid || (this.templateFile && (this.replaceStatus || this.appendStatus))) {
      if (this.userForm.valid) {
        console.log(this.userForm.value);
        this.usersService.adduser(this.userForm.value)
          .subscribe(
            (response) => {
              console.log("userrr", response)
              if (response.status == true) {
                this.router.navigate(['admin/users/success'])

              }
            }, err => {
              console.log(err);
              this.popupService.showServerError(err.error.message)
            })

      }
      else {
        console.log("xlfileupload");

        // this.usersService.adduser
      }
    }
    else {
      this.validateAllFormFields(this.userForm)
    }
  }
  bulkupload() {

    this.usersService.addDumpUser(this.fileupload)
      .subscribe(
        (response) => {
          // console.log("userrr", response)
          this.usersFormData = response;
          if (this.usersFormData.status == true) {
            this.router.navigate(['admin/users/users-added'])
          }

          // if (this.usersFormData.status == true && this.usersFormData.data.InvalidUsers == '') {

          // }
          if (this.usersFormData.status == true && this.usersFormData.data.InvalidUsers) {
            this.popupService.show

          }
        },
        (err) => {
          this.popupService.showServerError(err.error.message)

        })
  }
  openDialog(data): void {
    let dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '550px',
      data: { txt: this.text },
      panelClass: 'confirm-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {


        if (data == 'bulkdata') {
          this.bulkupload()
        }
      }

    });
  }
  updateUser() {
    console.log("fwefwef");

    if (this.importData == true || (this.replaceStatus == false && this.appendStatus == false)) {
      if (!this.templateFile)
        this.validate = true;
      if (this.replaceStatus == false && this.appendStatus == false)
        this.option = false;
    }
    if (this.userForm.valid || (this.templateFile && (this.replaceStatus || this.appendStatus))) {
      if (this.userForm.valid) {
        console.log(this.userForm.value);

        // this.userForm.value.append('id',this.id);


        var data = this.userForm.value;

        data['id'] = this.id;

        console.log(data);

        this.usersService.updateUser(data)
          .subscribe(
            (response) => {
              console.log("userrr", response)
              if (response.status == true) {
                this.router.navigate(['admin/users/update'])

              }
            }, err => {
              console.log(err);
              this.popupService.showServerError(err.error.message)
            })
      }
      else {
        console.log("xlfileupload");

        // this.usersService.adduser
      }
    }
    else {
      this.validateAllFormFields(this.userForm)
    }
  }

  cancelUser() {
    if (this.importData == false) {
      this.router.navigate(['admin/users']);
    }
    this.importData = !this.importData;
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
  fileSelected(event) {
    this.validate = false;
    this.templateFile = event.target.files[0];

    console.log("jjjjjjjjj", this.templateFile);

  }
  onchange($event) {
    console.log($event);
    this.userForm.reset()
    this.importData = $event.checked;

  }
  addUserDump() {
    console.log('dump');
    if (this.importData == true || (this.replaceStatus == false && this.appendStatus == false)) {
      if (!this.templateFile) this.validate = true;
      else {
        console.log("xlfile");
        this.fileupload = new FormData();
        this.fileupload.append('file', this.templateFile)
        this.text = "Are you sure you want append the users data?"

        this.openDialog('bulkdata');

      }
    }
  }
  onAppend($event) {
    console.log($event);
    this.replaceStatus = false;
    this.appendStatus = $event.checked;
    this.option = $event.checked;

  }
  onReplace($event) {
    console.log($event);
    this.appendStatus = false;
    this.replaceStatus = $event.checked;
    this.option = $event.checked;

  }
  showHidePassword() {
    this.showPassword = !this.showPassword;
  }
}
