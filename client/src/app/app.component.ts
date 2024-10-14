import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';


  constructor(
    private router: Router) { }

  ngOnInit(): void {

  }


  // isLoggedIn(): boolean {
  //   return this.authService.isLoggedIn();
  // }

  isLoggedIn(): any {
    // return this.authService.isLoggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    // this.authService.getToken(); // Update the token subject
    this.router.navigate(['/login']);
  }
}
