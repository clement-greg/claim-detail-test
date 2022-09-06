import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTestComponent } from './container-test.component';

describe('ContainerTestComponent', () => {
  let component: ContainerTestComponent;
  let fixture: ComponentFixture<ContainerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
