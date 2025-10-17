import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdBubaComponent } from './std-buba.component';

describe('StdBubaComponent', () => {
  let component: StdBubaComponent;
  let fixture: ComponentFixture<StdBubaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StdBubaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StdBubaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
