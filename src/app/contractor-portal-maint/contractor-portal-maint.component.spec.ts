import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorPortalMaintComponent } from './contractor-portal-maint.component';

describe('ContractorPortalMaintComponent', () => {
  let component: ContractorPortalMaintComponent;
  let fixture: ComponentFixture<ContractorPortalMaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorPortalMaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorPortalMaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
