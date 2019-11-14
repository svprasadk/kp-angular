import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) { }


  login(loginDetails) {
    return this.http.post(environment.url + "Admin/login", loginDetails)
      .map((response: Response) => {
        return <any>response;
      });
  }
  forgotPassword(details) {
    return this.http.post(environment.url + "Admin/forgotPasswordMail", details)
      .map((response: Response) => {
        return <any>response;
      });
  }
  resetPassword(data) {
    return this.http.put(environment.url + "Admin/resetPassword", data)
      .map((response: Response) => {
        return <any>response;
      });
  }

  asktheExpert(details) {
    return this.http.post(environment.url + "Admin/asktheExpert", details)
      .map((response: Response) => {
        return <any>response;
      });
  }

  feedback(details) {
    return this.http.post(environment.url + "Admin/feedback", details)
      .map((response: Response) => {
        return <any>response;
      });
  }
}
