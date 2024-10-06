import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerInvoicesComponent } from './admin-customer-invoices.component';

describe('AdminCustomerInvoicesComponent', () => {
  let component: AdminCustomerInvoicesComponent;
  let fixture: ComponentFixture<AdminCustomerInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCustomerInvoicesComponent]
    });
    fixture = TestBed.createComponent(AdminCustomerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
