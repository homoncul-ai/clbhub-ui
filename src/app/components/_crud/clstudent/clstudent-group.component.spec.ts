import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLStudentGroupComponent } from './clstudent-group.component';

describe('CLStudentGroupComponent', () => {
  let component: CLStudentGroupComponent;
  let fixture: ComponentFixture<CLStudentGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLStudentGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLStudentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
