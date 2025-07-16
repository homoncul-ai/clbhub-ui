import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkrequesttypeCrudComponent } from './workrequesttype-crud.component';

describe('WorkrequesttypeCrudComponent', () => {
  let component: WorkrequesttypeCrudComponent;
  let fixture: ComponentFixture<WorkrequesttypeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkrequesttypeCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkrequesttypeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
