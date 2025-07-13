import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkrequestCrudComponent } from './workrequest-crud.component';

describe('WorkrequestCrudComponent', () => {
  let component: WorkrequestCrudComponent;
  let fixture: ComponentFixture<WorkrequestCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkrequestCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkrequestCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
