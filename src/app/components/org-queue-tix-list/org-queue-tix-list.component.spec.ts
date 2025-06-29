import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgQueueTixListComponent } from './org-queue-tix-list.component';

describe('OrgQueueTixListComponent', () => {
  let component: OrgQueueTixListComponent;
  let fixture: ComponentFixture<OrgQueueTixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgQueueTixListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgQueueTixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
