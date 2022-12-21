import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplianceAuthoTwoComponent } from './appliance-autho-two.component';

describe('ApplianceAuthoTwoComponent', () => {
  let component: ApplianceAuthoTwoComponent;
  let fixture: ComponentFixture<ApplianceAuthoTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplianceAuthoTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplianceAuthoTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
