import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCircleAnimatedComponent } from './check-circle-animated.component';

describe('CheckCircleAnimatedComponent', () => {
  let component: CheckCircleAnimatedComponent;
  let fixture: ComponentFixture<CheckCircleAnimatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckCircleAnimatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckCircleAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
