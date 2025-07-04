import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTabsetComponent } from './simple-tabset.component';

describe('SimpleTabsetComponent', () => {
  let component: SimpleTabsetComponent;
  let fixture: ComponentFixture<SimpleTabsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleTabsetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleTabsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
