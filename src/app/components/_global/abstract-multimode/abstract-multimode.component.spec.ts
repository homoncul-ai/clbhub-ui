import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractMultimodeComponent } from './abstract-multimode.component';

describe('AbstractMultimodeComponent', () => {
  let component: AbstractMultimodeComponent;
  let fixture: ComponentFixture<AbstractMultimodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractMultimodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractMultimodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
