import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClschoolCrudComponent } from './clschool-crud.component';

describe('ClschoolCrudComponent', () => {
  let component: ClschoolCrudComponent;
  let fixture: ComponentFixture<ClschoolCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClschoolCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClschoolCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
