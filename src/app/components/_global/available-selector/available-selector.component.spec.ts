import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableSelectorComponent } from './available-selector.component';

describe('AvailableSelectorComponent', () => {
  let component: AvailableSelectorComponent;
  let fixture: ComponentFixture<AvailableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
