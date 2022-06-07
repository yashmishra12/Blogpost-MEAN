import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})

export class AuthService {
  uri: string = "http://localhost:3000/api/user/"

  constructor(private http: HttpClient){}

  createUser(email: string, password: string) {

    const authData: AuthData = {email, password};

    this.http.post(this.uri+"signup", authData).subscribe( response => { console.log(response)})
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post(this.uri+"login", authData).subscribe(response => { console.log(response)});
  }
}
