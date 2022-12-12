import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclesLoginComponent } from './circles-login.component';

describe('CirclesLoginComponent', () => {
  let component: CirclesLoginComponent;
  let fixture: ComponentFixture<CirclesLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirclesLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclesLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
