import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { PMessageUiComponent } from './pmessage-ui.component';
import { HcclService } from '../../../restsvc/hccl.service';
import { 
  PMessageGETData, 
  PMessageEntryGETData, 
  PMessageEntryGETDataSearchResults,
  PMessageAttachmentGETData,
  PMessageAttachmentGETDataSearchResults,
  PMessageParticipantGETData,
  PMessageParticipantGETDataSearchResults
} from '../../../restsvc/hccl.service';

describe('PMessageUiComponent', () => {
  let component: PMessageUiComponent;
  let fixture: ComponentFixture<PMessageUiComponent>;
  let mockHcclService: jasmine.SpyObj<HcclService>;

  const mockPMessage: PMessageGETData = {
    id: 'test-pmessage-id',
    subjectEntityName: 'Test Message Thread',
    dateCreated: { date: '2024-01-01T00:00:00Z' },
    dateLastUpdated: { date: '2024-01-01T12:00:00Z' }
  };

  const mockMessageEntries: PMessageEntryGETData[] = [
    {
      id: 'entry-1',
      body: 'Test message content',
      bodyFormatCode: 'PLAINTEXT',
      dateCreated: { date: '2024-01-01T10:00:00Z' },
      createdByInfo: { name: 'Test User' }
    }
  ];

  const mockAttachments: PMessageAttachmentGETData[] = [
    {
      id: 'attachment-1',
      attachmentEntityName: 'test-file.pdf',
      attachmentEntityType: 'PDF',
      attachmentEntityId: 'file-123',
      dateCreated: { date: '2024-01-01T11:00:00Z' }
    }
  ];

  const mockParticipants: PMessageParticipantGETData[] = [
    {
      id: 'participant-1',
      dateCreated: { date: '2024-01-01T09:00:00Z' },
      createdByInfo: { name: 'Participant User' }
    }
  ];

  beforeEach(async () => {
    const hcclServiceSpy = jasmine.createSpyObj('HcclService', [
      'getPMessageById',
      'findPMessageEntrys',
      'findPMessageAttachments',
      'findPMessageParticipants',
      'createPMessageEntry'
    ]);

    await TestBed.configureTestingModule({
      imports: [PMessageUiComponent, HttpClientTestingModule],
      providers: [
        { provide: HcclService, useValue: hcclServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PMessageUiComponent);
    component = fixture.componentInstance;
    mockHcclService = TestBed.inject(HcclService) as jasmine.SpyObj<HcclService>;

    // Setup default mock responses
    mockHcclService.getPMessageById.and.returnValue(of(mockPMessage));
    mockHcclService.findPMessageEntrys.and.returnValue(of({ searchResults: mockMessageEntries }));
    mockHcclService.findPMessageAttachments.and.returnValue(of({ searchResults: mockAttachments }));
    mockHcclService.findPMessageParticipants.and.returnValue(of({ searchResults: mockParticipants }));
    mockHcclService.createPMessageEntry.and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabs on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tabs.length).toBe(3);
    expect(component.tabs[0].id).toBe('messages');
    expect(component.tabs[1].id).toBe('attachments');
    expect(component.tabs[2].id).toBe('participants');
  });

  it('should load pmessage when id is provided', () => {
    component.id = 'test-id';
    component.ngOnInit();
    
    expect(mockHcclService.getPMessageById).toHaveBeenCalledWith('test-id');
    expect(component.pmessage).toEqual(mockPMessage);
    expect(component.loading).toBeFalse();
  });

  it('should handle pmessage loading error', () => {
    const errorMessage = 'Test error';
    mockHcclService.getPMessageById.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.id = 'test-id';
    component.ngOnInit();
    
    expect(component.error).toContain(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should load message entries when messages tab is selected', () => {
    component.id = 'test-id';
    component.pmessage = mockPMessage;
    component.showMessagesTab();
    
    expect(mockHcclService.findPMessageEntrys).toHaveBeenCalled();
    expect(component.currentTabId).toBe('messages');
  });

  it('should load attachments when attachments tab is selected', () => {
    component.id = 'test-id';
    component.pmessage = mockPMessage;
    component.showAttachmentsTab();
    
    expect(mockHcclService.findPMessageAttachments).toHaveBeenCalled();
    expect(component.currentTabId).toBe('attachments');
  });

  it('should load participants when participants tab is selected', () => {
    component.id = 'test-id';
    component.pmessage = mockPMessage;
    component.showParticipantsTab();
    
    expect(mockHcclService.findPMessageParticipants).toHaveBeenCalled();
    expect(component.currentTabId).toBe('participants');
  });

  it('should post message when postMessage is called', () => {
    component.id = 'test-id';
    component.newMessageText = 'Test message';
    component.readonly = false;
    
    component.postMessage();
    
    expect(mockHcclService.createPMessageEntry).toHaveBeenCalledWith({
      pmessageId: 'test-id',
      body: 'Test message',
      bodyFormatCode: 'PLAINTEXT'
    });
    expect(component.newMessageText).toBe('');
  });

  it('should not post message when readonly is true', () => {
    component.id = 'test-id';
    component.newMessageText = 'Test message';
    component.readonly = true;
    
    component.postMessage();
    
    expect(mockHcclService.createPMessageEntry).not.toHaveBeenCalled();
  });

  it('should not post message when text is empty', () => {
    component.id = 'test-id';
    component.newMessageText = '';
    component.readonly = false;
    
    component.postMessage();
    
    expect(mockHcclService.createPMessageEntry).not.toHaveBeenCalled();
  });

  it('should handle post message error', () => {
    const errorMessage = 'Post error';
    mockHcclService.createPMessageEntry.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.id = 'test-id';
    component.newMessageText = 'Test message';
    component.readonly = false;
    
    component.postMessage();
    
    expect(component.error).toContain(errorMessage);
    expect(component.postingMessage).toBeFalse();
  });

  it('should format date correctly', () => {
    const dateData = { date: '2024-01-01T12:00:00Z' };
    const formatted = component.formatDate(dateData);
    
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });

  it('should get message author name correctly', () => {
    const entry: PMessageEntryGETData = {
      id: 'test',
      createdByInfo: { name: 'Test User' }
    };
    
    const authorName = component.getMessageAuthorName(entry);
    expect(authorName).toBe('Test User');
  });

  it('should return Unknown User when no author info', () => {
    const entry: PMessageEntryGETData = {
      id: 'test'
    };
    
    const authorName = component.getMessageAuthorName(entry);
    expect(authorName).toBe('Unknown User');
  });

  it('should get participant user profile id', () => {
    const participant: PMessageParticipantGETData = {
      id: 'participant-123'
    };
    
    const profileId = component.getParticipantUserProfileId(participant);
    expect(profileId).toBe('participant-123');
  });

  it('should handle tab selection', () => {
    spyOn(component, 'showMessagesTab');
    
    component.onTabSelected('messages');
    
    expect(component.currentTabId).toBe('messages');
  });

  it('should handle ngOnChanges when id changes', () => {
    spyOn(component, 'loadPMessage');
    
    component.ngOnChanges({
      id: {
        currentValue: 'new-id',
        previousValue: 'old-id',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.loadPMessage).toHaveBeenCalled();
  });
});
