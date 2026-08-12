import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenEngageInterestComponent } from './citizen-engage-interest.component';

describe('CitizenEngageInterestComponent', () => {
  let component: CitizenEngageInterestComponent;
  let fixture: ComponentFixture<CitizenEngageInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenEngageInterestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenEngageInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
