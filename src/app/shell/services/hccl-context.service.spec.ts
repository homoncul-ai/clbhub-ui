import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HcclContextService } from './hccl-context.service';
import { HcclService, HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { Logger } from '@core/services';

describe('HcclContextService', () => {
  let service: HcclContextService;
  let mockHcclService: jasmine.SpyObj<HcclService>;

  const mockContext: HcclUserContextGETData = {
    currentUserProfileId: 'test-profile-id',
    currentUserProfile: {
      id: 'test-profile-id',
      userId: 'test-user-id',
      userCode: 'TEST001',
      organizationId: 'test-org-id',
      profileTypeCode: 'ADVOCATE',
      userEmail: 'test@example.com',
      available: 1
    },
    messages: {
      messages: []
    },
    userProfileMenu: {
      applicationName: 'HCCL',
      clientId: 'test-client',
      menuId: 'test-menu',
      menuName: 'Test Menu',
      label: 'Test Menu Label',
      menuItems: [],
      defaultAllowedByRule: true
    }
  };

  beforeEach(() => {
    const hcclServiceSpy = jasmine.createSpyObj('HcclService', ['resolveTicketContext']);

    TestBed.configureTestingModule({
      providers: [
        HcclContextService,
        { provide: HcclService, useValue: hcclServiceSpy }
      ]
    });

    service = TestBed.inject(HcclContextService);
    mockHcclService = TestBed.inject(HcclService) as jasmine.SpyObj<HcclService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    const state = service.getState();
    expect(state.isInitialized).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.context).toBe(null);
    expect(state.lastUpdated).toBe(null);
  });

  it('should initialize context successfully', (done) => {
    mockHcclService.resolveTicketContext.and.returnValue(of(mockContext));

    service.initializeContext('test-profile-id').subscribe({
      next: (context) => {
        expect(context).toEqual(mockContext);
        expect(service.isReady()).toBe(true);
        expect(service.getContext()).toEqual(mockContext);
        expect(service.getCurrentUserProfileId()).toBe('test-profile-id');
        expect(service.getCurrentUserProfile()).toEqual(mockContext.currentUserProfile);
        expect(service.getUserProfileMenu()).toEqual(mockContext.userProfileMenu);
        expect(service.getMessages()).toEqual(mockContext.messages);
        done();
      },
      error: done.fail
    });
  });

  it('should handle initialization error', (done) => {
    const errorMessage = 'Network error';
    mockHcclService.resolveTicketContext.and.returnValue(throwError(() => new Error(errorMessage)));

    service.initializeContext('test-profile-id').subscribe({
      next: () => {
        expect(service.isReady()).toBe(false);
        expect(service.getContext()).toBe(null);
        expect(service.error()).toBe(errorMessage);
        done();
      },
      error: done.fail
    });
  });

  it('should clear context', () => {
    // First initialize with some data
    mockHcclService.resolveTicketContext.and.returnValue(of(mockContext));
    
    service.initializeContext('test-profile-id').subscribe(() => {
      expect(service.isReady()).toBe(true);
      
      // Clear context
      service.clearContext();
      
      expect(service.isReady()).toBe(false);
      expect(service.getContext()).toBe(null);
      expect(service.isInitialized()).toBe(false);
    });
  });

  it('should refresh context', (done) => {
    mockHcclService.resolveTicketContext.and.returnValue(of(mockContext));

    service.refreshContext('test-profile-id').subscribe({
      next: (context) => {
        expect(context).toEqual(mockContext);
        expect(service.isReady()).toBe(true);
        done();
      },
      error: done.fail
    });
  });

  it('should wait for ready with timeout', async () => {
    // Test timeout scenario
    try {
      await service.waitForReady(100); // 100ms timeout
      fail('Should have timed out');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('Timeout');
    }
  });

  it('should provide reactive state updates', (done) => {
    mockHcclService.resolveTicketContext.and.returnValue(of(mockContext));

    // Subscribe to context$ observable for state changes
    service.context$.subscribe(context => {
      if (context) {
        expect(context).toEqual(mockContext);
        expect(service.isReady()).toBe(true);
        expect(service.getState().isLoading).toBe(false);
        expect(service.getState().error).toBe(null);
        expect(service.getState().lastUpdated).toBeInstanceOf(Date);
        done();
      }
    });

    service.initializeContext('test-profile-id').subscribe();
  });
}); 