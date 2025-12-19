import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEngageInterestComponent } from './student-engage-interest.component';

describe('StudentEngageInterestComponent', () => {
  let component: StudentEngageInterestComponent;
  let fixture: ComponentFixture<StudentEngageInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEngageInterestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEngageInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
