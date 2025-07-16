import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkqueueCrudComponent } from './workqueue-crud.component';

describe('WorkqueueCrudComponent', () => {
  let component: WorkqueueCrudComponent;
  let fixture: ComponentFixture<WorkqueueCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkqueueCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkqueueCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
