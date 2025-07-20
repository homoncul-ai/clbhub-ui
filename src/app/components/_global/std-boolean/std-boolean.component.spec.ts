import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StdBooleanComponent, BooleanMode } from './std-boolean.component';

describe('StdBooleanComponent', () => {
  let component: StdBooleanComponent;
  let fixture: ComponentFixture<StdBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StdBooleanComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StdBooleanComponent);
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
    expect(component.showRequiredIndicator).toBe(true);
    expect(component.showErrorIndicator).toBe(true);
    expect(component.helpText).toBe('');
    expect(component.mode).toBe('checkbox');
    expect(component.yesText).toBe('Yes');
    expect(component.noText).toBe('No');
  });

  it('should generate unique ID', () => {
    expect(component.uniqueId).toContain(component.prefix);
    expect(component.uniqueId).toContain(component.name);
  });

  it('should emit valueChange event', () => {
    spyOn(component.valueChange, 'emit');
    component.value = true;
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should implement ControlValueAccessor methods', () => {
    const mockFn = jasmine.createSpy('mockFn');
    
    component.registerOnChange(mockFn);
    component.registerOnTouched(mockFn);
    
    component.writeValue(true);
    expect(component.value).toBe(true);
    
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('should handle input events for checkbox', () => {
    const mockEvent = { target: { checked: true } };
    spyOn(component.valueChange, 'emit');
    
    component.onInput(mockEvent);
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should handle blur events', () => {
    const mockFn = jasmine.createSpy('mockFn');
    component.registerOnTouched(mockFn);
    
    component.onBlur();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle yes/no change events', () => {
    spyOn(component.valueChange, 'emit');
    
    component.onYesNoChange(true);
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
    
    component.onYesNoChange(false);
    expect(component.valueChange.emit).toHaveBeenCalledWith(false);
  });

  it('should toggle value when not disabled', () => {
    component.value = false;
    component.disabled = false;
    spyOn(component.valueChange, 'emit');
    
    component.toggleValue();
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should not toggle value when disabled', () => {
    component.value = false;
    component.disabled = true;
    spyOn(component.valueChange, 'emit');
    
    component.toggleValue();
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should return correct mode flags', () => {
    component.mode = 'checkbox';
    expect(component.isCheckboxMode).toBe(true);
    expect(component.isYesNoMode).toBe(false);
    
    component.mode = 'yesno';
    expect(component.isCheckboxMode).toBe(false);
    expect(component.isYesNoMode).toBe(true);
  });

  it('should handle error states', () => {
    const mockError = {
      testField: { errorMessage: 'This field is required' }
    };
    
    component.name = 'testField';
    component.error = mockError;
    
    expect(component.hasError).toBe(true);
    expect(component.errorMessage).toBe('This field is required');
  });

  it('should handle no error states', () => {
    component.name = 'testField';
    component.error = null;
    
    expect(component.hasError).toBe(false);
    expect(component.errorMessage).toBe('');
  });
}); 