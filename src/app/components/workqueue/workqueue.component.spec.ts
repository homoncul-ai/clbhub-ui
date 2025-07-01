import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkqueueComponent } from './workqueue.component';

describe('WorkqueueComponent', () => {
  let component: WorkqueueComponent;
  let fixture: ComponentFixture<WorkqueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkqueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
