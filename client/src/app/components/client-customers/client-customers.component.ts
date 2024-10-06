import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ClientService } from 'src/app/service/client.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-client-customers',
  templateUrl: './client-customers.component.html',
  styleUrls: ['./client-customers.component.css']
})
export class ClientCustomersComponent implements OnInit {

  selectedClient: any;
  customers: any[] = [];

  constructor(private clientService: ClientService,
    private customerService: CustomerService,
    private router: Router,) { }



  onSelectCustomer(customer: any): void {
    this.clientService.selectCustomer(customer);
    this.router.navigate(['/admin/admin-customer-invoice']);
  }


  ngOnInit(): void {
    this.clientService.selectedClient$.subscribe(client => {
      this.selectedClient = client;
    });

    this.fetchCustomers();
  }


  fetchCustomers(): void {
    this.customerService.getCustomerByUser(this.selectedClient.userId).subscribe(
      (response) => {

        this.customers = response.data;

        console.error('Data:', response);
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
}
