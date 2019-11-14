import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  constructor() {
    console.log("Token : ");

  }

  public getToken(): string {
    return localStorage.getItem("token");
  }

  public isAuthenticated(): boolean {
    console.log("Token : ", "fdkjbfdsfdkjhbfds");
    const token = this.getToken();
    console.log("Token : ", token);
    return token ? true : false;
  }

}