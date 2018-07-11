import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppError } from './errors/app-error';
import { BadInput } from './errors/bad-input';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url = 'http://120.78.187.115:5000/api/login';
  private change_password_url = 'http://120.78.187.115:5000/api/password';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credential) {
    return this.http.post(this.login_url, credential)
      .pipe(
        map(res => {
          console.log(res);
          if (res && res['token']) {
            localStorage.setItem('token', res['token']);
            return true;
          }
          return false;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const isExpired = jwtHelper.isTokenExpired(token);
    return !isExpired;
  }

  private handleError(error) {
    if (error.status === 400) {
      return throwError(new BadInput(error));
    }
    return throwError(new AppError(error));
  }
}