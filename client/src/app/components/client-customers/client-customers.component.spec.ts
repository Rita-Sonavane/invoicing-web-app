import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCustomersComponent } from './client-customers.component';

describe('ClientCustomersComponent', () => {
  let component: ClientCustomersComponent;
  let fixture: ComponentFixture<ClientCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientCustomersComponent]
    });
    fixture = TestBed.createComponent(ClientCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
