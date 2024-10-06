import { Injectable } from '@angular/core';
import { BASE_URL } from '../shared/constants/urls';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
// import { clearClient, setClient } from '../shared/client.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${BASE_URL}/users`;

  private tokenSubject = new BehaviorSubject<string>(localStorage.getItem('token') || '');
  private currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));

  constructor(private http: HttpClient, private store: Store<{ currentClinet: any }>) {

  }


  signIn(credentials: { email: string, password: string }): Observable<any> {
    console.log('Sign in credentials', credentials);
    return this.http.post(`${this.apiUrl}/signin`, credentials)
  }


  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }


  getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }


  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot`, { email });
  }

  resetPassword(email: string, newPassword: string, confirmpassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset`, { email, newPassword, confirmpassword });
  }

  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    // this.tokenSubject.next('null');
    // this.currentUserSubject.next(null);
    // Dispatch the clearUser action on logout
    // this.store.dispatch(clearClient());
  }


  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  storeTokenAndUser(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.result));
    localStorage.setItem('userRole', JSON.stringify(response.result.role));

    this.currentUserSubject.next(response.result);
    console.log('Token and user stored:', response);
  }

  getUserRole(): string | any {
    return localStorage.getItem('userRole');
  }



}