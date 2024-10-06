import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ProfileService } from 'src/app/service/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.invoiceService.getInvoices(this.currentUser._id).subscribe(
      (repsonse) => {
        console.log("data", repsonse.data);
        this.invoices = repsonse.data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  navigateToInvoice(id: any) {
    this.router.navigate(['/dashboard/invoice', id]);
  }


  editInvoice(invoice: any, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/dashboard/edit/invoice', invoice._id]);
  }

  confirmDelete(id: string, event: Event) {
    event.stopPropagation();
    if (id) {
      console.log("Delete", id);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this invoice?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.invoiceService.deleteInvoice(id).subscribe(
            response => {
              Swal.fire({
                title: 'Success',
                text: 'Invoice deleted successfully',
                icon: 'success',
                timer: 1000, // Close after 2 seconds
                showConfirmButton: false // Hide the confirm button
              }).then(() => {
                console.log('Invoice deleted', response);
                this.fetchInvoices(); 
              });
            },
            error => {
              console.log(error);
              Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
            }
          );
        } 
        // else if (result.dismiss === Swal.DismissReason.cancel) {
        //   Swal.fire('Cancelled', 'The invoice was not deleted.', 'info');
        // }
      });
    }
  }
  
}