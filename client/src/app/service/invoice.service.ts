import { Injectable } from '@angular/core';
import { BASE_URL } from '../shared/constants/urls';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../shared/interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceURL = `${BASE_URL}/invoices`;
  BASE_URL: any;

  constructor(private http: HttpClient) { }

  getInvoice(id: string): Observable<any> {
    console.log("inside get", id)
    return this.http.get(`${this.invoiceURL}/get/${id}`);
  }


  getInvoices(clientId: string): Observable<any> {
    return this.http.get(`${this.invoiceURL}/user?searchQuery=${clientId}`);
  }

  createInvoice(invoice: Invoice): Observable<any> {
    return this.http.post(`${this.invoiceURL}/add`, invoice);
  }

  updateInvoice(id: string, invoice: Invoice): Observable<any> {
    return this.http.put(`${this.invoiceURL}/update/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<any> {
    return this.http.delete(`${this.invoiceURL}/delete/${id}`);
  }

  getTotalInvoiceCount(): Observable<any> {
    return this.http.get<any>(`${this.invoiceURL}/count`);
  }

  getInvoiceStatusCounts(): Observable<any> {
    return this.http.get<any>(`${this.invoiceURL}/status-count`);
  }

  getNextInvoiceNumber(): Observable<any> {
    return this.http.get<{ nextInvoiceNumber: number }>(`${this.invoiceURL}/next-invoice-number`);
  }

  generatePDF(id: string): Observable<any> {
    return this.http.post(`${this.invoiceURL}/generate-pdf/${id}`, '', { responseType: 'blob' });
  }

  sendPDF(email: any, id: string): Observable<any> {
    return this.http.post(`${this.invoiceURL}/send-invoice-email/${id}`, { email });
  }

}
