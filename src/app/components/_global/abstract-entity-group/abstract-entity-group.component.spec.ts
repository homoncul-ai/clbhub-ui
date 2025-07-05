import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractEntityGroupComponent } from './abstract-entity-group.component';

describe('AbstractEntityGroupComponent', () => {
  let component: AbstractEntityGroupComponent;
  let fixture: ComponentFixture<AbstractEntityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractEntityGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractEntityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
