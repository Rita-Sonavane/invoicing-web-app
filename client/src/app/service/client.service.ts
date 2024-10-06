import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private selectedClientSubject = new BehaviorSubject<any>(null);
  selectedClient$ = this.selectedClientSubject.asObservable();

  private selectedCustomerSubject = new BehaviorSubject<any>(null);
  selectedCustomer$ = this.selectedCustomerSubject.asObservable();


  private customersSubject = new BehaviorSubject<any[]>([]);
  customers$ = this.customersSubject.asObservable();

  updateCustomers(customers: any[]) {
    this.customersSubject.next(customers);
  }


  constructor() {

  }

  selectClient(client: any) {
    console.log("selected client", client);
    this.selectedClientSubject.next(client);
  }

  clearSelectedClient() {
    this.selectedClientSubject.next(null);
  }

  selectCustomer(customer: any) {
    console.log("selected customer", customer);
    this.selectedCustomerSubject.next(customer);
  }

  clearSelectedCustomer() {
    this.selectedCustomerSubject.next(null);
  }



}
