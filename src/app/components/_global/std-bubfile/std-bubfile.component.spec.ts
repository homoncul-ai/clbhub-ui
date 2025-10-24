import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StdBubfileComponent } from './std-bubfile.component';
import { HcclService } from '@app/restsvc/hccl.service';

describe('StdBubfileComponent', () => {
  let component: StdBubfileComponent;
  let fixture: ComponentFixture<StdBubfileComponent>;
  let mockHcclService: jasmine.SpyObj<HcclService>;

  beforeEach(async () => {
    const hcclServiceSpy = jasmine.createSpyObj('HcclService', ['getPMFileById']);

    await TestBed.configureTestingModule({
      imports: [StdBubfileComponent],
      providers: [
        { provide: HcclService, useValue: hcclServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StdBubfileComponent);
    component = fixture.componentInstance;
    mockHcclService = TestBed.inject(HcclService) as jasmine.SpyObj<HcclService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load PMFile data when entityId is provided', () => {
    const mockPMFile = {
      id: 'test-id',
      downloadAs: 'test-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
      downloadFileUrl: 'https://example.com/test-file.pdf'
    };

    mockHcclService.getPMFileById.and.returnValue(of(mockPMFile));
    
    component.entityId = 'test-id';
    component.ngOnInit();

    expect(mockHcclService.getPMFileById).toHaveBeenCalledWith('test-id');
  });

  it('should return correct file icon based on extension', () => {
    component.pmFile = {
      downloadAs: 'test-file.pdf'
    } as any;

    const icon = component.getFileIcon();
    expect(icon).toBe('/imgs/fileicons/pdf.svg');
  });

  it('should return generic file icon for unknown extension', () => {
    component.pmFile = {
      downloadAs: 'test-file.unknown'
    } as any;

    const icon = component.getFileIcon();
    expect(icon).toBe('/imgs/fileicons/generic-file.svg');
  });

  it('should open file URL in new tab when clicked', () => {
    const mockFileUrl = 'https://example.com/test-file.pdf';
    component.pmFile = {
      downloadFileUrl: mockFileUrl
    } as any;

    spyOn(window, 'open');
    
    const mockEvent = {
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;

    component.onFileClick(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(mockFileUrl, '_blank');
  });
});
