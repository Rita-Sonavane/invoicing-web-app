import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ProfileService } from 'src/app/service/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invoiceForm: FormGroup | any;
  invoice: any = {};
  currentUser: any;
  profile: any;
  today: string = new Date().toISOString().split('T')[0];
  @ViewChild('invoiceContainer') invoiceContainer: ElementRef | any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {


    this.invoiceForm = this.fb.group({
      paymentRecords: this.fb.group({
        datePaid: [this.today],
        amountPaid: ['', [Validators.required]],
        paymentMethod: ['', [Validators.required]],
        note: [''],
        paidBy: ['']
      })
    });



    const invoiceId = this.route.snapshot.paramMap.get('id');
    if (invoiceId) {
      this.fetchInvoiceDetails(invoiceId);
    }

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      this.fetchProfile(this.currentUser._id);
      console.log("Current User", this.currentUser.name);
    });
  }



  fetchInvoiceDetails(invoiceId: string): void {
    this.invoiceService.getInvoice(invoiceId).subscribe(
      (response) => {
        this.invoice = response;

        console.log("Invoice details", this.invoice);
      },
      (error) => {
        console.error('Error fetching invoice details:', error);
      }
    );
  }

  fetchProfile(id: string): void {
    this.profileService.getProfile(id).subscribe(
      data => {
        this.profile = data;
        console.log('Profile:', this.profile);
      },
      error => {
        console.error('Error fetching profile:', error);
      }
    );
  }



  // edit Invoice
  editInvoice() {
    // navigate to edit invoice component
    this.router.navigate(['/dashboard/invoice/edit/invoice', this.invoice._id]);
  }

  onSubmit() {
    console.log(this.invoiceForm.value);
    const invoideData = this.invoiceForm.value;
    if (this.invoice._id) {
      this.invoiceService.updateInvoice(this.invoice._id, invoideData).subscribe(
        (response) => {
          console.log('Customer updated', response);

          Swal.fire({
            title: 'Success',
            text: 'Record Payment successfully',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.fetchInvoiceDetails(this.invoice._id);
          });

          const modal = document.getElementById('addCustomerModal');
          if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal?.hide();

            const backdrop = document.querySelector('.modal-backdrop.show');
            if (backdrop) {
              backdrop.classList.remove('show');
              backdrop.classList.add('fade');
              setTimeout(() => backdrop.remove(), 150);
            }
          }
        },
        (error) => {
          console.log(error);
          Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
        }
      );
    }
  }



  generatePdf() {
    const htmlContent = this.invoiceContainer.nativeElement.innerHTML;
    this.isLoading = true;
    this.invoiceService.generatePDF(this.invoice._id).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;

        Swal.fire({
          title: 'Success',
          text: 'PDF generated successfully.',
          icon: 'success',
          timer: 1000, // Automatically close after 2 seconds
          showConfirmButton: false // Hide the confirm button
        });
      },
      (error) => {
        console.error('Error generating PDF:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Error generating PDF. Please try again later.',
          icon: 'error',
          timer: 1000, // Automatically close after 2 seconds
          showConfirmButton: false // Hide the confirm button

        });
      }
    );
  }

  sendInvoice() {
    this.isLoading = true;
    const email = this.invoice.client.email;
    console.log(email, "clicked");

    this.invoiceService.sendPDF(email, this.invoice._id)
      .subscribe(
        response => {
          console.log('Invoice sent successfully', response);
          this.isLoading = false;  // Hide loader

          Swal.fire({
            title: 'Success',
            text: 'Invoice sent successfully.',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        },
        error => {
          console.error('Error sending invoice', error);
          this.isLoading = false;  // Hide loader

          Swal.fire({
            // title: 'Error',
            // text: 'Error sending invoice. Please try again later.',
            // icon: 'error',
            // timer: 2000, // Automatically close after 2 seconds
            // showConfirmButton: false // Hide the confirm button
            title: 'Success',
            text: 'Invoice sent successfully.',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        }
      );
  }


}