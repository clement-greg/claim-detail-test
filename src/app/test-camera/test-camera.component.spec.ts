import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCameraComponent } from './test-camera.component';

describe('TestCameraComponent', () => {
  let component: TestCameraComponent;
  let fixture: ComponentFixture<TestCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
