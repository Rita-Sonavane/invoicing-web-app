import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { CustomerService } from 'src/app/service/customer.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  @Output() customerAdded = new EventEmitter<void>();
  currentUser: any;
  customerForm: FormGroup | any;
  customers: any[] = [];

  countryCode: string = '';
  mobile: string = '';
  phone: string = '';
  fax: string = '';


  constructor(private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private invoiceService: InvoiceService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });


    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+\d{10,}$/)]],
      building: [''],
      addressLine1: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      countryCode: ['+1'],
      country: ['', [Validators.required]],
      mobile: ['', [Validators.pattern(/^\+\d{10,}$/)]],
      fax: ['', [Validators.pattern(/^\+?\d{7,}$/)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\- ]+$/)]],
    });


    // this.customerForm.get('countryCode')?.valueChanges.subscribe((value: any) => {
    //   console.log("KJSKFJSAH",);
    //   this.onCountryCodeChange(value);
    // });

  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }
    console.log("click");

    const customerData = this.customerForm.value;
    customerData.userId = [this.currentUser._id];
    console.log("customerData", customerData);

    this.customerService.createCustomers(customerData).subscribe(
      (response) => {
        console.log('Customer added', response);
        this.customerAdded.emit();
        this.fetchCustomers(); // Refresh the customer list
        this.customerForm.reset(); // Reset the form

        Swal.fire({
          title: 'Success',
          text: 'You Added Customer successfully',
          icon: 'success',
          timer: 1000, // Automatically close after 2 seconds
          showConfirmButton: false // Hide the confirm button
        });

        // Close the modal
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
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    );
  }

  fetchCustomers(): void {
    this.customerService.getCustomerByUser(this.currentUser._id).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.customers = response.data;
        } else {
          console.error('Data is not an array:', response);
        }
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  onCountryCodeChange(event: any) {
    let value = event.target.value;

    if (value === '' || value === '+') {
      return;
    }

    if (!value.startsWith('+')) {
      value = '+' + value;
    }

    this.customerForm.patchValue({ countryCode: value });

    const countryCode = this.customerForm.get('countryCode')?.value || '+';

    this.customerForm.patchValue({
      phone: `${countryCode}${this.customerForm.get('phone')?.value?.replace(/^\+\d+/, '')}`,
      mobile: `${countryCode}${this.customerForm.get('mobile')?.value?.replace(/^\+\d+/, '')}`,
      fax: `${countryCode}${this.customerForm.get('fax')?.value?.replace(/^\+\d+/, '')}`
    });
  }


  // updateMobile(no: any) {
  //   this.mobile = no.target.value.replace(this.countryCode, '');
  //   this.updateFields();
  // }

  // updatePhone(no: any) {
  //   this.phone = no.target.value.replace(this.countryCode, '');
  //   this.updateFields();
  // }

  // updateFax(no: any) {
  //   this.fax = no.target.value.replace(this.countryCode, '');
  //   this.updateFields();
  // }

}
