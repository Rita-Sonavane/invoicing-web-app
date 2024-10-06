import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';
import { Customer } from '../shared/interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customerURL = `${BASE_URL}/clients`;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.customerURL}/`);
  }

  createCustomers(userData: Customer): Observable<any> {
    return this.http.post(`${this.customerURL}/add`, userData);
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.post<any>(`${this.customerURL}/update/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.customerURL}/delete/${id}`);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<any>(`${this.customerURL}/${id}`);
  }

  // getCustomerByUser(userId: string): Observable<any> {
  //   return this.http.get<Customer>(`${this.customerURL}/user/${userId}`);
  // }

  getCustomerByUser(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.customerURL}/user?searchQuery=${clientId}`);
  }


}
