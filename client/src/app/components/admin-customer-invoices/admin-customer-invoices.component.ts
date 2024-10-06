import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/service/client.service';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-admin-customer-invoices',
  templateUrl: './admin-customer-invoices.component.html',
  styleUrls: ['./admin-customer-invoices.component.css']
})
export class AdminCustomerInvoicesComponent {

  selectedClient: any;
  invoices: any[] = [];

  constructor(private clientService: ClientService,
    private invoiceService: InvoiceService,
    private router: Router,) { }


  ngOnInit(): void {
    this.clientService.selectedClient$.subscribe(client => {
      this.selectedClient = client;
    });

    this.fetchInvoices();
  }


  fetchInvoices(): void {
    console.log("check>>>>>>>>>>>>>.",this.selectedClient._id)
    this.invoiceService.getInvoices(this.selectedClient.userId).subscribe(
      (response) => {

        this.invoices = response.data;

        console.error('Data:', response);
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  navigateToInvoice(id:string){
    
  }
}
