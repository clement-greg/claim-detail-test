import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearsTestComponent } from './gears-test.component';

describe('GearsTestComponent', () => {
  let component: GearsTestComponent;
  let fixture: ComponentFixture<GearsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearsTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
