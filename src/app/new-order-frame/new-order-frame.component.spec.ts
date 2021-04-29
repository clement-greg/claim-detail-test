import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderFrameComponent } from './new-order-frame.component';

describe('NewOrderFrameComponent', () => {
  let component: NewOrderFrameComponent;
  let fixture: ComponentFixture<NewOrderFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrderFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
