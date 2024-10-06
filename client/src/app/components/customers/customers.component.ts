import { ChangeDetectorRef, Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { Customer } from 'src/app/shared/interfaces/customer';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customerForm: FormGroup | any;
  customers: any[] = [];

  currentUser: any;

  modalTitle: string = 'Add Customer';
  modalButtonText: string = 'Save Customer';
  editingCustomerId: string | any;
  deletingCustomerId: string | any;

  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router, private authService: AuthService
  ) {

  }



  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
    });

    this.fetchCustomers();


  }


  fetchCustomers(): void {
    this.customerService.getCustomerByUser(this.currentUser._id).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.customers = response.data;
          console.log("customers", this.customers)
        } else {
          console.error('Data is not an array:', response);
        }
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  onCustomerAdded(): void {
    this.fetchCustomers();
  }




  // Call this method when the edit button is clicked
  editCustomer(customer: Customer): void {
    console.log("Edit Mode", customer);

    this.modalTitle = 'Edit Customer';
    this.modalButtonText = 'Update Customer';
    this.editingCustomerId = customer._id;
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });

    //opem model  
    const modal = document.getElementById('addCustomerModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      bsModal?.show();
    }
  }


  confirmDelete(customer: Customer): void {
    this.deletingCustomerId = customer._id;
    if (this.deletingCustomerId) {
      console.log("Delete", this.deletingCustomerId);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this customer?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.customerService.deleteCustomer(this.deletingCustomerId).subscribe(
            response => {
              Swal.fire({
                title: 'Deleted!',
                text: 'The customer has been deleted.',
                icon: 'success',
                timer: 1000, // Automatically close after 2 seconds
                showConfirmButton: false // Hide the confirm button
              }).then(() => {
                console.log('Customer deleted', response);
                this.fetchCustomers(); // Refresh the customer list
                this.customerForm.reset(); // Reset the form
              });
            },
            error => {
              console.log(error);
              Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
            }
          );
        }
      });
    }
  }




}
