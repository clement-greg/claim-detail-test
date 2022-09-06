import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrobTestComponent } from './throb-test.component';

describe('ThrobTestComponent', () => {
  let component: ThrobTestComponent;
  let fixture: ComponentFixture<ThrobTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThrobTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThrobTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
