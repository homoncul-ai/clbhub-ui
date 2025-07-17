import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DategetdataDisplayComponent } from './dategetdata-display.component';

describe('DategetdataDisplayComponent', () => {
  let component: DategetdataDisplayComponent;
  let fixture: ComponentFixture<DategetdataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DategetdataDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DategetdataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
