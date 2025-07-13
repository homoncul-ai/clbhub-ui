import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkrequestUpdateComponent } from './workrequest-update.component';

describe('WorkrequestUpdateComponent', () => {
  let component: WorkrequestUpdateComponent;
  let fixture: ComponentFixture<WorkrequestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkrequestUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkrequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
