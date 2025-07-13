import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkrequestGroupComponent } from './workrequest-group.component';

describe('WorkrequestGroupComponent', () => {
  let component: WorkrequestGroupComponent;
  let fixture: ComponentFixture<WorkrequestGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkrequestGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkrequestGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
