import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuControlDataListComponent } from './menu-control-data-list.component';

describe('MenuControlDataListComponent', () => {
  let component: MenuControlDataListComponent;
  let fixture: ComponentFixture<MenuControlDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuControlDataListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuControlDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
