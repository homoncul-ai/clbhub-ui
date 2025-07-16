import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClstudentCrudComponent } from './clstudent-crud.component';

describe('ClstudentCrudComponent', () => {
  let component: ClstudentCrudComponent;
  let fixture: ComponentFixture<ClstudentCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClstudentCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClstudentCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
