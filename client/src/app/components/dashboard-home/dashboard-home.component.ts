import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ProfileService } from 'src/app/service/profile.service';
import { loadClient } from 'src/app/shared/app-state/client/client.actions';
import { selectClient } from 'src/app/shared/app-state/client/client.selector';
import { loadProfile } from 'src/app/shared/app-state/profile/profile.action';
import { selectProfile } from 'src/app/shared/app-state/profile/profile.selector';
import { Client } from 'src/app/shared/interfaces/client';
import { Profile } from 'src/app/shared/interfaces/profile';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  invoices: any[] = [];
  currentUser: any;
  profile: any;
  invoiceCount: number = 0;
  searchQuery: string = '';
  paidCount: number = 0;
  unpaidCount: number = 0;

  client$: Observable<Client | any>;
  profile$: Observable<Profile | any>;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private store: Store<any>
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


    this.fetchInvoices();
    this.getInvoiceCount();
    this.getStatusCounts();
  }

  getStatusCounts(): void {
    this.invoiceService.getInvoiceStatusCounts().subscribe(
      response => {
        this.paidCount = response.paidCount;
        this.unpaidCount = response.unpaidCount;
        // console.log("check staus", this.paidCount, this.unpaidCount)
      },
      error => {
        console.error('Error fetching status counts', error);
      }
    );
  }

  fetchInvoices(): void {
    this.invoiceService.getInvoices(this.currentUser._id).subscribe(
      (data) => {
        // console.log("data", data);
        this.invoices = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  getInvoiceCount(): void {

    this.invoiceService.getTotalInvoiceCount().subscribe(
      (response) => {
        this.invoiceCount = response;
        // console.log("get cont", this.invoiceCount);
      },
      (error) => {
        console.error('Error fetching invoice count', error);
      }
    );
  }



}
