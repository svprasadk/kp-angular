
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs';
@Injectable()
export class LoadingbarService {
  showLoading: boolean = false;
  hide() {
    console.log("Loading bar : hide", );
    // this.showLoadingOb.next(false);
    this.showLoading = false;
  }

  show() {
    console.log("Loading bar : Show");
    this.showLoading = true;

    console.log("Loading bar jvh: ", this.showLoading);
  }
}
