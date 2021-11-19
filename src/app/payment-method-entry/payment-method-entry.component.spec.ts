import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodEntryComponent } from './payment-method-entry.component';

describe('PaymentMethodEntryComponent', () => {
  let component: PaymentMethodEntryComponent;
  let fixture: ComponentFixture<PaymentMethodEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMethodEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
