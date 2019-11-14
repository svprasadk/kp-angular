import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import "rxjs/add/operator/map";
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class CategoriesService {
  authToken: string;
  public serverUrl = environment.url;

  public userRoute = "/v1.0";

  constructor(private http: HttpClient,
    private httpData: Http) { }

  uplaodImage(details) {
    return this.http
      .post(environment.url + "Category/uploadBannerImage", details)
      .map((response: Response) => {
        return <any>response;
      });
  }
  addCategory(postdata) {
    return this.http
      .post(environment.url + "Category/addCategory", postdata)
      .map((response: Response) => {
        return <any>response;
      });
  }
  updateCategory(postdata) {
    return this.http
      .put(environment.url + "Category/updateCategory", postdata)
      .map((response: Response) => {
        return <any>response;
      });
  }
  getCategories() {
    return this.http
      .get(environment.url + "Category/fetchCategories")
      .map((response: Response) => {
        return <any>response;
      });
  }
  getCategory(id) {
    return this.http
      .get(environment.url + "Category/fetchSingleCategory/" + id)
      .map((response: Response) => {
        return <any>response;
      });
  }
  publishUnpublish(id, status) {
    return this.http
      .get(environment.url + "Category/publishTheCategory/" + id + "/" + status)
      .map((response: Response) => {
        return <any>response;
      });
  }
  deleteCategory(id) {
    return this.http
      .get(environment.url + "Category/deleteCategory/" + id)
      .map((response: Response) => {
        return <any>response;
      });
  }

  getAllProducts(data?) {
    var newdata = {}
    if (data) {
      newdata = data;
    }
    this.authToken = localStorage.getItem('token');
    var headers: any = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('x-access-token', this.authToken);

    let options = new RequestOptions({ headers: headers, params: newdata });
    return this.httpData.get(environment.url + 'Product/fetchProducts', options)

  }


}
