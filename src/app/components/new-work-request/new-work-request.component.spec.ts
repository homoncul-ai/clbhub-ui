import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorkRequestComponent } from './new-work-request.component';

describe('NewWorkRequestComponent', () => {
  let component: NewWorkRequestComponent;
  let fixture: ComponentFixture<NewWorkRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWorkRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWorkRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
