import { Component, OnInit, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { AboutusService } from 'services/aboutus.service';
import { PopupService } from 'services/popup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @ViewChild('f') subForm: HTMLFormElement;
  f: Form;
  constructor(private aboutusService: AboutusService, private popupService: PopupService, private route: ActivatedRoute, private router: Router) { }
  heading: String;
  description: String;
  aboutUs: Array<any> = [];
  submitted: boolean = false;
  id: String;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getSingleAbout()
      }
    });
  }
  getSingleAbout() {
    this.aboutusService.getSingleAboutUs(this.id).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        this.heading = res.data.heading;
        this.description = res.data.description;
      }

    }, err => {
      console.log(err);
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.subForm.form.valid) {
      var data: any = {
        heading: this.heading,
        description: this.description
      }
      // this.aboutUs.push({ heading: this.heading, description: this.description });
      if (this.id) {
        data.id = this.id;
        this.aboutusService.updateAboutUs(data).subscribe((res: any) => {
          console.log(res);
          this.popupService.show("Successfully updated About Us");
          this.router.navigate(['/admin/about'])
          this.clearForms()

        }, err => {
          console.log(err);
        })
      } else {
        this.aboutusService.addAboutUs(data).subscribe((res: any) => {
          console.log(res);
          this.popupService.show("Successfully added About Us");
          this.clearForms()

        }, err => {
          console.log(err);
        })
      }

    }
  }
  cancel() {
    if (this.id) {
      this.router.navigate(['/admin/about'])

    } else {
      this.clearForms()
    }
  }
  clearForms() {
    this.submitted = false;
    this.heading = '';
    this.description = '';
    this.subForm.form.controls['heading'].markAsUntouched();
    this.subForm.form.controls['heading'].setErrors(null);
    this.subForm.form.controls['description'].markAsUntouched();
    this.subForm.form.controls['description'].setErrors(null);
    this.subForm.form.markAsPristine();
    this.subForm.form.markAsUntouched();
    this.subForm.form.updateValueAndValidity();
  }
}
