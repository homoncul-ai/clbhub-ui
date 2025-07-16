import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcclOrganizationCrudComponent } from './hccl-organization-crud.component';

describe('HcclOrganizationCrudComponent', () => {
  let component: HcclOrganizationCrudComponent;
  let fixture: ComponentFixture<HcclOrganizationCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HcclOrganizationCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcclOrganizationCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
