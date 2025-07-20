import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StdMdbDatepickerComponent } from './std-mdb-datepicker.component';

describe('StdMdbDatepickerComponent', () => {
  let component: StdMdbDatepickerComponent;
  let fixture: ComponentFixture<StdMdbDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StdMdbDatepickerComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StdMdbDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.prefix).toBe('');
    expect(component.name).toBe('');
    expect(component.label).toBe('');
    expect(component.required).toBe(false);
    expect(component.disabled).toBe(false);
    expect(component.placeholder).toBe('MM/DD/YYYY');
    expect(component.showRequiredIndicator).toBe(true);
    expect(component.showErrorIndicator).toBe(true);
    expect(component.helpText).toBe('');
  });

  it('should generate unique ID', () => {
    expect(component.uniqueId).toContain(component.prefix);
    expect(component.uniqueId).toContain(component.name);
  });

  it('should emit valueChange event', () => {
    spyOn(component.valueChange, 'emit');
    component.value = '12/25/2023';
    expect(component.valueChange.emit).toHaveBeenCalledWith('12/25/2023');
  });

  it('should implement ControlValueAccessor methods', () => {
    const mockFn = jasmine.createSpy('mockFn');
    
    component.registerOnChange(mockFn);
    component.registerOnTouched(mockFn);
    
    component.writeValue('12/25/2023');
    expect(component.value).toBe('12/25/2023');
    
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('should handle input events', () => {
    const mockEvent = { target: { value: '12/25/2023' } };
    spyOn(component.valueChange, 'emit');
    
    component.onInput(mockEvent);
    expect(component.valueChange.emit).toHaveBeenCalledWith('12/25/2023');
  });

  it('should handle blur events', () => {
    const mockFn = jasmine.createSpy('mockFn');
    component.registerOnTouched(mockFn);
    
    component.onBlur();
    expect(mockFn).toHaveBeenCalled();
  });
}); 