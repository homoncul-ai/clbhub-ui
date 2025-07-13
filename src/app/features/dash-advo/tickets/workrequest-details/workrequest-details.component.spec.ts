import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkrequestDetailsComponent } from './workrequest-details.component';

describe('WorkrequestDetailsComponent', () => {
  let component: WorkrequestDetailsComponent;
  let fixture: ComponentFixture<WorkrequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkrequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkrequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
