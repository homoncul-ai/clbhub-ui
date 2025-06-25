import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstudentComponent } from './clstudent.component';

describe('ClstudentComponent', () => {
  let component: ClstudentComponent;
  let fixture: ComponentFixture<ClstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClstudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
