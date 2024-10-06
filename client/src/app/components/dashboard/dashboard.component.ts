import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { loadClient } from 'src/app/shared/app-state/client/client.actions';
import { selectClient } from 'src/app/shared/app-state/client/client.selector';
import { loadProfile } from 'src/app/shared/app-state/profile/profile.action';
import { selectProfile } from 'src/app/shared/app-state/profile/profile.selector';
import { Client } from 'src/app/shared/interfaces/client';
import { Profile } from 'src/app/shared/interfaces/profile';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  isAdmin: boolean = false;
  currentUser: Client | any;
  profile: Profile | any;
  currentRoute: string = '';
  profileId: string = '';

  client$: Observable<Client | any>;
  profile$: Observable<Profile | any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.client$ = this.store.pipe(select(selectClient));
    this.profile$ = this.store.pipe(select(selectProfile));
  }

  ngOnInit(): void {
    // Dispatch loadClient action to fetch client data
    this.store.dispatch(loadClient());

    // Subscribe to client$ observable to get the current client data
    this.client$.subscribe(client => {
      console.log("Current client value:", client);
      this.currentUser = client;
    });


    this.store.dispatch(loadProfile({ id: this.currentUser._id }));

    // Subscribe to profile$ observable to get the current profile data
    this.profile$.subscribe(profile => {
      console.log('Profile:', profile);
      this.profile = profile;
    });

    // Determine if the user is an admin
    this.isAdmin = this.authService.getUserRole() === 'admin';

    // Update navigation label based on the current route
    this.updateNavLabel();
    this.router.events.subscribe(() => {
      this.updateNavLabel();
    });
  }



  updateNavLabel() {
    const currentUrl = this.router.url;
    switch (true) {
      case currentUrl.includes('/dashboard/dashboard-home'):
        this.currentRoute = 'Dashboard';
        break;
      case currentUrl.includes('/dashboard/invoice/invoices-list'):
        this.currentRoute = 'Invoices List';
        break;
      case currentUrl.includes('/dashboard/invoice'):
        this.currentRoute = 'Create Invoice';
        break;
      case currentUrl.includes('customers'):
        this.currentRoute = 'Customers';
        break;
      case currentUrl.includes('/dashboard/client-profile'):
        this.currentRoute = 'Profile';
        break;
      case currentUrl.includes('/admin/clients'):
        this.currentRoute = 'Client List';
        break;
      default:
        this.currentRoute = 'Dashboard';
        break;
    }
  }

  onLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Logging out...");
        this.authService.signOut();
        this.router.navigate(['/login']).then(() => {
          Swal.fire({
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        });
      }
    });
  }

  ngAfterViewInit() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const closeBtn = document.getElementById('btn') as HTMLElement;
    const searchBtn = document.querySelector('.bx-search') as HTMLElement;
    const LogoutBtn = document.querySelector('#log_out') as HTMLElement;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(sidebar, closeBtn);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(sidebar, closeBtn);
      });
    }

    if (LogoutBtn) {
      LogoutBtn.addEventListener('click', () => {
        console.log("Logout Cliked");
        this.onLogout();
      });
    }
  }

  menuBtnChange(sidebar: HTMLElement, closeBtn: HTMLElement) {
    if (sidebar.classList.contains('open')) {
      closeBtn.classList.remove('bx-menu');
      closeBtn.classList.add('bx-menu-alt-right');
    } else {
      closeBtn.classList.remove('bx-menu-alt-right');
      closeBtn.classList.add('bx-menu');
    }
  }
}

