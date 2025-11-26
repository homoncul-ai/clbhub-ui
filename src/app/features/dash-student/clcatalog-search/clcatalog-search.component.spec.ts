
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLCatalogSearchComponent } from './clcatalog-search.component';

describe('CatalogSearch', () => {
  let component: CLCatalogSearchComponent;
  let fixture: ComponentFixture<CLCatalogSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLCatalogSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLCatalogSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
