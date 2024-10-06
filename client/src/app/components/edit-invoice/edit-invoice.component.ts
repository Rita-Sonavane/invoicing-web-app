import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ProfileService } from 'src/app/service/profile.service';
import { Currency } from '../invoice/invoice.component';
import { CustomerService } from 'src/app/service/customer.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent implements OnInit {
  invoice: any = {};
  currentUser: any;
  profile: any;
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
  today = new Date();
  nextInvoiceNumber: number = 0;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
    });

    this.fetchCustomers();

    this.invoiceForm = this.fb.group({
      invoiceNumber: [],
      type: ['Invoice'],
      status: [],
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




    //
    const invoiceId = this.route.snapshot.paramMap.get('id');
    if (invoiceId) {
      this.fetchInvoiceDetails(invoiceId);
    }


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

  fetchInvoiceDetails(invoiceId: string): void {
    this.invoiceService.getInvoice(invoiceId).subscribe(
      (response) => {
        this.invoice = response;
        console.log("Invoice details", this.invoice);
        this.patchInvoiceDetails();
      },
      (error) => {
        console.error('Error fetching invoice details:', error);
      }
    );
  }

  fetchCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        console.log("data", data);
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  patchInvoiceDetails(): void {

    // Patch the main invoice form
    this.invoiceForm.patchValue({
      invoiceNumber: this.invoice.invoiceNumber,
      type: this.invoice.type,
      status: this.invoice.status,
      dueDate: this.invoice.dueDate,
      currency: this.invoice.currency,
      taxRate: this.invoice.taxRate,
      notes: this.invoice.notes,
      subTotal: this.invoice.subTotal,
      total: this.invoice.total,
      vat: this.invoice.vat,
      client: {
        name: this.invoice.client.name,
        email: this.invoice.client.email,
        phone: this.invoice.client.phone,
        address: this.invoice.client.address
      }
    });

    console.log("in side Patch Value", this.invoiceForm);



    // Handle the items array separately
    if (Array.isArray(this.invoice.items)) {
      const items = this.invoiceForm.get('items') as FormArray;
      items.clear();

      this.invoice.items.forEach((item: any) => {
        items.push(this.fb.group({
          itemName: [item.itemName],
          quantity: [item.quantity],
          unitPrice: [item.unitPrice],
          discount: [item.discount],
          amount: [item.amount],
        }));
      });





    } else {
      console.error('Invoice items is not an array:', this.invoice.items);
    }


    this.selectedCustomer = {
      name: this.invoice.client.name,
      email: this.invoice.client.email,
      phone: this.invoice.client.phone,
      address: this.invoice.client.address
    };

    // this.selectedCustomer = this.customers.find(customer => customer._id === this.invoice.customerId);
    this.showDropdown = false;



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
    // Calculate subtotal
    this.subTotal = this.items.controls.reduce((acc, item) => {
      const itemAmount = Number(item.get('amount')!.value); // Ensure the value is treated as a number
      console.log("Item Amount:", itemAmount);
      return acc + itemAmount;
    }, 0);

    // Log subtotal
    console.log("Subtotal:", this.subTotal);

    // Get tax rate and handle null case
    let taxRate = Number(this.invoiceForm.get('taxRate')!.value);
    if (isNaN(taxRate) || taxRate === null) {
      taxRate = 0;
    }
    console.log("Tax Rate:", taxRate);

    // Calculate VAT
    this.vat = (this.subTotal * taxRate) / 100;
    console.log("VAT:", this.vat);

    // Calculate total
    this.total = this.subTotal + this.vat;
    console.log("Total:", this.total);
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
      // formData.taxRate = this.taxRate;
      formData.dueDate = new Date(formData.dueDate);
      // formData.customer = this.selectedCustomer;

      formData.client = {
        name: this.selectedCustomer.name,
        email: this.selectedCustomer.email,
        phone: this.selectedCustomer.phone,
        address: this.selectedCustomer.address
      };

      console.log("Form", formData);

      this.invoiceService.updateInvoice(this.invoice._id, formData).subscribe(
        (response) => {
          console.log('Invoice updated successfully:', response);
          Swal.fire({
            title: 'Success',
            text: 'Invoice updated successfully',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.invoiceForm.reset();
            this.router.navigate(['/dashboard/invoice', response._id]);
          });
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong. Please try again later.',
            icon: 'error',
            timer: 2000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }

}
