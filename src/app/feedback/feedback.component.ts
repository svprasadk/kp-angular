import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PopupService } from '../services/popup.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class feedbackComponent implements OnInit {
  public dynamicWindowHeight;
  public feedbackForm: FormGroup
  hide = true;
  isValid: boolean = false;
  public errorMessage: any;
  id: any;
  constructor(private router: Router,
    private fb: FormBuilder,
    private popupService: PopupService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      Message: ['', Validators.required]
    });
  }  

  getErrorMessage() {
    return this.feedbackForm.get('Message').hasError('required') ? 'Please Provide Message' : '';
  }

  Submit() {
    this.isValid = true;
    var data = this.feedbackForm.value;
    data['id'] = this.id;
    console.log(data);
    if (this.feedbackForm.valid) {
      this.authenticationService.feedback(data)
        .subscribe(
          (response) => {
            console.log("feedback", response)
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
