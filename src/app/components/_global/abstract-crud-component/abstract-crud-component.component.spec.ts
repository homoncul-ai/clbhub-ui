import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractCrudComponentComponent } from './abstract-crud-component.component';

describe('AbstractCrudComponentComponent', () => {
  let component: AbstractCrudComponentComponent;
  let fixture: ComponentFixture<AbstractCrudComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractCrudComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractCrudComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
