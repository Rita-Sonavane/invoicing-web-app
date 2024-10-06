import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';


  constructor(
    // private authService: AuthService,
    private router: Router) {}

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
