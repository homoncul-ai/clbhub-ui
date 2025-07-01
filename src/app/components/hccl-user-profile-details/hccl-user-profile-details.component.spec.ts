import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HcclUserProfileDetailsComponent } from './hccl-user-profile-details.component';
import { HcclService } from '../../restsvc/hccl.service';
import { HcclUserProfileGETData } from '../../restsvc/hccl.service';

describe('HcclUserProfileDetailsComponent', () => {
  let component: HcclUserProfileDetailsComponent;
  let fixture: ComponentFixture<HcclUserProfileDetailsComponent>;
  let mockHcclService: jasmine.SpyObj<HcclService>;

  const mockUserProfile: HcclUserProfileGETData = {
    id: 'test-id-123',
    userCode: 'TEST001',
    userId: 'user-123',
    organizationId: 'org-456',
    profileTypeCode: 'STUDENT',
    userEmail: 'test@example.com',
    cellPhoneNumber: '555-123-4567',
    workPhoneNumber: '555-987-6543',
    available: 1,
    externalUserId: 'ext-123',
    externalUserEntityType: 'STUDENT',
    externalUserName: 'Test User',
    dateCreated: {
      date: '2024-01-01T00:00:00Z',
      formattedDate: '01/01/2024',
      formattedDateTime: '01/01/2024 00:00:00'
    },
    createdByInfo: {
      name: 'System Admin',
      link: '/admin'
    },
    dateLastUpdated: {
      date: '2024-01-15T00:00:00Z',
      formattedDate: '01/15/2024',
      formattedDateTime: '01/15/2024 00:00:00'
    },
    lastUpdatedByInfo: {
      name: 'System Admin',
      link: '/admin'
    }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HcclService', ['findHcclUserProfiles']);
    mockHcclService = spy;

    await TestBed.configureTestingModule({
      imports: [HcclUserProfileDetailsComponent],
      providers: [
        { provide: HcclService, useValue: mockHcclService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcclUserProfileDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile when userProfileId is provided', () => {
    const mockResponse = {
      searchResults: [mockUserProfile]
    };
    mockHcclService.findHcclUserProfiles.and.returnValue(of(mockResponse));

    component.userProfileId = 'test-id-123';
    component.ngOnInit();

    expect(mockHcclService.findHcclUserProfiles).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 1,
      isPaging: true,
      ids: ['test-id-123']
    });
    expect(component.userProfile).toEqual(mockUserProfile);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading user profile fails', () => {
    const errorMessage = 'Network error';
    mockHcclService.findHcclUserProfiles.and.returnValue(throwError(() => new Error(errorMessage)));

    component.userProfileId = 'test-id-123';
    component.ngOnInit();

    expect(component.error).toContain('Error loading user profile');
    expect(component.loading).toBeFalse();
    expect(component.userProfile).toBeNull();
  });

  it('should handle case when user profile is not found', () => {
    const mockResponse = {
      searchResults: []
    };
    mockHcclService.findHcclUserProfiles.and.returnValue(of(mockResponse));

    component.userProfileId = 'non-existent-id';
    component.ngOnInit();

    expect(component.error).toBe('User profile not found');
    expect(component.loading).toBeFalse();
    expect(component.userProfile).toBeNull();
  });

  it('should return correct available status', () => {
    expect(component.getAvailableStatus(1)).toBe('Available');
    expect(component.getAvailableStatus(0)).toBe('Not Available');
    expect(component.getAvailableStatus(undefined)).toBe('Not Available');
  });

  it('should return correct available status class', () => {
    expect(component.getAvailableStatusClass(1)).toBe('status-available');
    expect(component.getAvailableStatusClass(0)).toBe('status-unavailable');
    expect(component.getAvailableStatusClass(undefined)).toBe('status-unavailable');
  });

  it('should format date correctly', () => {
    const dateData = {
      formattedDate: '01/01/2024',
      date: '2024-01-01T00:00:00Z'
    };
    expect(component.formatDate(dateData)).toBe('01/01/2024');
    expect(component.formatDate(null)).toBe('N/A');
  });

  it('should format date time correctly', () => {
    const dateData = {
      formattedDateTime: '01/01/2024 00:00:00',
      date: '2024-01-01T00:00:00Z'
    };
    expect(component.formatDateTime(dateData)).toBe('01/01/2024 00:00:00');
    expect(component.formatDateTime(null)).toBe('N/A');
  });

  it('should not load user profile when userProfileId is not provided', () => {
    component.ngOnInit();
    expect(mockHcclService.findHcclUserProfiles).not.toHaveBeenCalled();
  });

  it('should return default title when no title is provided', () => {
    expect(component.displayTitle).toBe('User Profile Details');
  });

  it('should return custom title when title is provided', () => {
    component.title = 'Student Profile Information';
    expect(component.displayTitle).toBe('Student Profile Information');
  });

  it('should update display title when title input changes', () => {
    expect(component.displayTitle).toBe('User Profile Details');
    
    component.title = 'Custom Profile Title';
    expect(component.displayTitle).toBe('Custom Profile Title');
  });
});
