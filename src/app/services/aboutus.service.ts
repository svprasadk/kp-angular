import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

import "rxjs/add/operator/map";

@Injectable()
export class AboutusService {

    constructor(private http: HttpClient) { }


    // login(loginDetails) {
    //     return this.http.post(environment.url + "Admin/login", loginDetails)
    //         .map((response: Response) => {
    //             return <any>response;
    //         });
    // }

    getAboutUs() {
        return this.http.get(environment.url + "AboutUs/fetchAboutUs")
    }
    addAboutUs(data) {
        return this.http.post(environment.url + "AboutUs/addAboutUs", data)
    }

    deleteAboutUs(id) {
        return this.http.delete(environment.url + "AboutUs/deleteAboutUs/" + id)
    }

    updateAboutUs(data) {
        return this.http.put(environment.url + "AboutUs/updateAboutusInfo", data)
    }

    getSingleAboutUs(id) {
        return this.http.get(environment.url + "AboutUs/fetchSingleAboutUs/" + id)
    }
}