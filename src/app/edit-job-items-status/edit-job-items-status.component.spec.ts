import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobItemsStatusComponent } from './edit-job-items-status.component';

describe('EditJobItemsStatusComponent', () => {
  let component: EditJobItemsStatusComponent;
  let fixture: ComponentFixture<EditJobItemsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJobItemsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobItemsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
