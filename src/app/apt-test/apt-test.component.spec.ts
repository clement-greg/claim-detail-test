import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AptTestComponent } from './apt-test.component';

describe('AptTestComponent', () => {
  let component: AptTestComponent;
  let fixture: ComponentFixture<AptTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AptTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AptTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
