import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { HcclUserProfileSelectorComponent } from './hccl-user-profile-selector.component';
import { HcclService, HcclUserProfileGETData } from '@app/restsvc/hccl.service';

describe('HcclUserProfileSelectorComponent', () => {
  let component: HcclUserProfileSelectorComponent;
  let fixture: ComponentFixture<HcclUserProfileSelectorComponent>;
  let findProfilesSpy: jasmine.Spy;

  const profileA: HcclUserProfileGETData = {
    id: 'a',
    messageHandle: 'alice',
    roles: ['Provider'],
    organization: { entityDisplayName: 'Org A' } as any,
  };
  const profileB: HcclUserProfileGETData = {
    id: 'b',
    messageHandle: 'bob',
    roles: ['NonprofitAdmin'],
    organization: { entityDisplayName: 'Org A' } as any,
  };
  const profileC: HcclUserProfileGETData = {
    id: 'c',
    messageHandle: 'cara',
    roles: [],
    organization: { entityDisplayName: 'Org A' } as any,
  };

  beforeEach(async () => {
    findProfilesSpy = jasmine.createSpy('findHcclUserProfiles').and.returnValue(
      of({ searchResults: [profileA, profileB, profileC] }),
    );

    await TestBed.configureTestingModule({
      imports: [HcclUserProfileSelectorComponent],
      providers: [{ provide: HcclService, useValue: { findHcclUserProfiles: findProfilesSpy } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HcclUserProfileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search until minSearchLength characters', fakeAsync(() => {
    component.minSearchLength = 4;
    component.searchText = 'ali';
    component.onSearchChange();
    tick(400);
    expect(findProfilesSpy).not.toHaveBeenCalled();
    expect(component.searchResults.length).toBe(0);

    component.searchText = 'alic';
    component.onSearchChange();
    tick(400);
    expect(findProfilesSpy).toHaveBeenCalled();
    expect(component.searchResults.length).toBe(3);
  }));

  it('should enforce maxAllowedToChoose', () => {
    component.maxAllowedToChoose = 2;
    component.selectResult(profileA);
    component.selectResult(profileB);
    component.selectResult(profileC);

    expect(component.chosenProfiles.length).toBe(2);
    expect(component.isSelected('c')).toBeFalse();
  });

  it('should not remove locked chips', () => {
    component.lockedIds = ['a'];
    component.selectedIds = ['a'];
    component.initialSelected = [profileA];
    component.ngOnChanges({
      lockedIds: {
        currentValue: ['a'],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
      selectedIds: {
        currentValue: ['a'],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
      initialSelected: {
        currentValue: [profileA],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    } as any);

    expect(component.isLocked('a')).toBeTrue();
    expect(component.chosenProfiles.length).toBe(1);

    component.removeChosen(profileA, new Event('click'));
    expect(component.isSelected('a')).toBeTrue();
    expect(component.chosenProfiles.length).toBe(1);
  });
});
