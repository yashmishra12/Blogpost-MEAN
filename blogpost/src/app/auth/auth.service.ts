import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})

export class AuthService {
  uri: string = "http://localhost:3000/api/user/";

  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken() { return this.token; }
  getIsAuth() {return this.isAuthenticated}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post(this.uri+"signup", authData).subscribe( response => { console.log(response)})
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number}>(this.uri+"login", authData).subscribe(response => {
      const token = response.token;
      this.token = token;

      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(["/"]);
      }
    });
  }



  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);

    this.clearAuthData()
    this.router.navigate(["/"]);
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo) { return;    }
    const now = new Date();

    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if(expiresIn>0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout( ()=>{ this.logout() }, duration*1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration");

    if(!token || !expirationDate) {return;}
    return {token, expirationDate: new Date(expirationDate)}
  }



}
