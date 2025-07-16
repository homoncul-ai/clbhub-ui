import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClschoolGroupComponent } from './clschool-group.component';

describe('ClschoolGroupComponent', () => {
  let component: ClschoolGroupComponent;
  let fixture: ComponentFixture<ClschoolGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClschoolGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClschoolGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
