import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMessagesSectionComponent } from './simple-messages-section.component';

describe('SimpleMessagesSectionComponent', () => {
  let component: SimpleMessagesSectionComponent;
  let fixture: ComponentFixture<SimpleMessagesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleMessagesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleMessagesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
