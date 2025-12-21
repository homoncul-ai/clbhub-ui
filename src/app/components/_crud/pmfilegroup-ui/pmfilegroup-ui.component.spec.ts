import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmfilegroupUiComponent } from './pmfilegroup-ui.component';

describe('PmfilegroupUiComponent', () => {
  let component: PmfilegroupUiComponent;
  let fixture: ComponentFixture<PmfilegroupUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmfilegroupUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmfilegroupUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
