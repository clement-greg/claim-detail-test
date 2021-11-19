import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRequestServiceComponent } from './test-request-service.component';

describe('TestRequestServiceComponent', () => {
  let component: TestRequestServiceComponent;
  let fixture: ComponentFixture<TestRequestServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRequestServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRequestServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
