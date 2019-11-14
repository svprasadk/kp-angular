import { Injectable } from '@angular/core';

import "rxjs/add/operator/map";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
@Injectable()
export class UsersService {

  public serverUrl = environment.url;
  constructor(private http: HttpClient) { }

  getAllUsers(postData) {
    return this.http
      .get(this.serverUrl + "Admin/fetchAllUsers", { params: postData })
      .map((response: Response) => {
        return <any>response;
      });
  }
  getUser(id) {
    return this.http
      .get(environment.url + "Admin/fetchSingleUser/" + id)
      .map((response: Response) => {
        return <any>response;
      });
  }
  adduser(userForm) {
    return this.http
      .post(this.serverUrl + "Admin/addUser", userForm)
      .map((response: Response) => {
        return <any>response;
      });
  }
  addDumpUser(userdata) {
    return this.http
      .post(this.serverUrl + "Admin/uploadUserData", userdata)
      .map((response: Response) => {
        return <any>response;
      });
  }

  deleteUser(id) {
    return this.http
      .get(environment.url + "Admin/deleteUser/" + id)
      .map((response: Response) => {
        return <any>response;
      });
  }
  updateUser(postdata) {
    return this.http
      .put(environment.url + "Admin/updateUserInfo", postdata)
      .map((response: Response) => {
        return <any>response;
      });
  }

  changePassword(data) {
    return this.http
      .put(environment.url + "Admin/changePassword", data)
      .map((response: Response) => {
        return <any>response;
      });
  }
}
