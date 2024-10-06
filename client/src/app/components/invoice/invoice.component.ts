import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { CustomerService } from 'src/app/service/customer.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';


export class Currency {
  label: string;
  value: string;

  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  currentUser: any;
  customerForm: FormGroup | any;
  customers: any[] = [];
  selectedCustomer: any;
  showDropdown: boolean = true;
  // items: any[] = [];
  currencies: Currency[] = [
    { label: "US Dollar", value: "USD" },
    { label: "Euro", value: "EUR" },
    { label: "British Pound", value: "GBP" },
    { label: "Japanese Yen", value: "JPY" },
    { label: "Canadian Dollar", value: "CAD" },
    { label: "Australian Dollar", value: "AUD" },
    { label: "Swiss Franc", value: "CHF" },
    { label: "Chinese Yuan", value: "CNY" },
    { label: "Swedish Krona", value: "SEK" },
    { label: "New Zealand Dollar", value: "NZD" },
    { label: "Mexican Peso", value: "MXN" },
    { label: "Singapore Dollar", value: "SGD" },
    { label: "Hong Kong Dollar", value: "HKD" },
    { label: "Norwegian Krone", value: "NOK" },
    { label: "South Korean Won", value: "KRW" },
    { label: "Turkish Lira", value: "TRY" },
    { label: "Russian Ruble", value: "RUB" },
    { label: "Indian Rupee", value: "INR" },
    { label: "Brazilian Real", value: "BRL" },
    { label: "South African Rand", value: "ZAR" }
  ];
  invoiceForm: FormGroup | any;
  subTotal: number = 0;
  total: number = 0;
  vat: number = 0;
  // taxRate: number = 0;
  today = new Date();
  nextInvoiceNumber: number = 0;


  constructor(private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private invoiceService: InvoiceService,
    private authService: AuthService
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

    this.invoiceForm = this.fb.group({
      invoiceNumber: [this.nextInvoiceNumber],
      type: ['Invoice'],
      status: ['Unpaid'],
      dueDate: [this.calculateDueDate()],
      currency: ['INR'],
      taxRate: [],
      items: this.fb.array([this.createItem()]),
      notes: [''],
      client: this.fb.group({
        name: [''],
        email: [''],
        phone: [''],
        address: ['']
      }),
      subTotal: [],
      total: [],
      vat: [],
      // rates: [, Validators.required],
    });

    // If selectedCustomer is available, update the form value
    if (this.selectedCustomer) {
      this.invoiceForm.patchValue({
        client: {
          name: this.selectedCustomer.name,
          email: this.selectedCustomer.email,
          phone: this.selectedCustomer.phone,
          address: this.selectedCustomer.address
        }
      });
    }

    this.invoiceForm.get('items').valueChanges.subscribe((values: any) => this.calculateTotal());


    this.invoiceForm.get('dueDate')!.valueChanges.subscribe((date: string) => {
      console.log('Due date changed:', date);
      this.calculateDueDate(date);
    });


    // get Invoice number
    this.invoiceService.getNextInvoiceNumber().subscribe((response: any) => {
      console.log("Inside the getNextInvoiceNumber", response)
      this.nextInvoiceNumber = response.nextInvoiceNumber;
      this.invoiceForm.patchValue({ invoiceNumber: this.nextInvoiceNumber });
    });

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

  createItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      amount: ['', { value: 0, disabled: true }]
    });
  }


  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }


  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateAmount(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')!.value;
    const unitPrice = item.get('unitPrice')!.value;
    const discount = item.get('discount')!.value;
    const amount = (quantity * unitPrice * (1 - discount / 100));
    item.get('amount')!.setValue(amount, { emitEvent: false });
    this.calculateTotal();
  }



  calculateTotal(): void {
    this.subTotal = this.items.controls.reduce((acc, item) => acc + item.get('amount')!.value, 0);
    const taxRate = this.invoiceForm.get('taxRate')!.value;
    this.vat = (this.subTotal * taxRate) / 100;
    this.total = this.subTotal + this.vat;
  }


  // drop down
  onCustomerChange(event: any): void {
    const customerId = event.target.value;
    this.selectedCustomer = this.customers.find(customer => customer._id === customerId);
    this.showDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = true;
  }

  calculateDueDate(currentDate?: string): any {
    let dueDate: Date;
    if (currentDate) {
      dueDate = new Date(currentDate);
      return dueDate.toISOString().split('T')[0];
    }
    else {

      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      return dueDate;
    }

  }



  onInvoiceSubmit() {
    if (this.invoiceForm.valid) {
      const formData = { ...this.invoiceForm.value };
      formData.subTotal = this.subTotal;
      formData.vat = this.vat;
      formData.total = this.total;
      formData.dueDate = new Date(formData.dueDate);
      formData.creator = [this.currentUser._id];
      formData.client = {
        name: this.selectedCustomer.name,
        email: this.selectedCustomer.email,
        phone: this.selectedCustomer.phone,
        address: this.selectedCustomer.address,
        userId: [this.currentUser._id]
      };

      console.log("Form", formData);

      this.invoiceService.createInvoice(formData).subscribe(
        (response) => {
          console.log('Invoice saved successfully:', response);
          // Reset form or navigate to another page as needed
          Swal.fire({
            title: 'Success',
            text: 'Invoice saved successfully',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.invoiceForm.reset();
            this.router.navigate(['/dashboard/invoice', response._id]);
          });

        },
        (error) => {
          console.error('Error saving invoice:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }



}
