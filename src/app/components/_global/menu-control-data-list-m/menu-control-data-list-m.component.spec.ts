import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuControlDataListMComponent } from './menu-control-data-list-m.component';

describe('MenuControlDataListMComponent', () => {
  let component: MenuControlDataListMComponent;
  let fixture: ComponentFixture<MenuControlDataListMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuControlDataListMComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuControlDataListMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
