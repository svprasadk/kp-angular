import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PopupService } from './../services/popup.service';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-asktheexpert',
  templateUrl: './asktheexpert.component.html',
  styleUrls: ['./asktheexpert.component.css']
})

export class AsktheexpertComponent implements OnInit {
  public dynamicWindowHeight;
  public asktheExpertForm: FormGroup
  hide = true;
  isValid: boolean = false;
  public errorMessage: any;
  id: any;
  constructor(private router: Router,
    private fb: FormBuilder,
    private popupService: PopupService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.asktheExpertForm = this.fb.group({
      Question: ['', Validators.required]
    });
  }  

  getErrorMessage() {
    return this.asktheExpertForm.get('Question').hasError('required') ? 'Please Provide Question' : '';
  }

  Submit() {
    this.isValid = true;
    var data = this.asktheExpertForm.value;
    data['id'] = this.id;
    console.log(data);
    if (this.asktheExpertForm.valid) {
      this.authenticationService.asktheExpert(data)
        .subscribe(
          (response) => {
            console.log("asktheexpert", response)
            if (response.status == true) {
              this.popupService.show(response.message);
              this.router.navigate(['/user/home']);
            }
          }, err => {
            console.log(err);
          })
    }
  }

}
