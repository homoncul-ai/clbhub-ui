import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

// Import all the std components
import { StdBooleanComponent } from '../../components/_global/std-boolean/std-boolean.component';
import { StdMdbIntegerComponent } from '../../components/_global/std-mdb-integer/std-mdb-integer.component';
import { StdMdbFormTextComponent } from '../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { StdMdbDatepickerComponent } from '../../components/_global/std-mdb-datepicker/std-mdb-datepicker.component';
import { StdMdbPhoneComponent } from '../../components/_global/std-mdb-phone/std-mdb-phone.component';

// Import additional components from field display guides
import { MenuControlDataListComponent } from '../../components/_global/menu-control-data-list/menu-control-data-list.component';
import { MenuControlDataListMComponent } from '../../components/_global/menu-control-data-list-m/menu-control-data-list-m.component';
import { AvailableSelectorComponent } from '../../components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '../../components/_global/dategetdata-display/dategetdata-display.component';

// Import types
import { MenuControlDataList, MenuControlData } from '../../restsvc/hccl.service';
import { DateGETData } from '../../restsvc/common-request-service.model';

@Component({
  selector: 'app-uistarter-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdbFormsModule,
    TranslateModule,
    StdBooleanComponent,
    StdMdbIntegerComponent,
    StdMdbFormTextComponent,
    StdMdbFormTextareaComponent,
    StdMdbDatepickerComponent,
    StdMdbPhoneComponent,
    MenuControlDataListComponent,
    MenuControlDataListMComponent,
    AvailableSelectorComponent,
    DategetdataDisplayComponent
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>Field Display Components Test Form</h2>
        <p>Test all field types from field-display-guides-component.prompt.txt</p>
        <div class="required-info">
          <h4>Required Fields for Form Submission:</h4>
          <ul>
            <li><strong>Text Input:</strong> Name (required)</li>
            <li><strong>Integer:</strong> Age (required)</li>
            <li><strong>Date:</strong> Birth Date (required)</li>
            <li><strong>Boolean:</strong> Active Status (required)</li>
            <li><strong>Menu Single:</strong> Country (required)</li>
          </ul>
        </div>
      </div>

      <form [formGroup]="testForm" (ngSubmit)="onSubmit()" class="test-form">
        
        <!-- String Values -->
        <div class="form-section">
          <h3>String Values</h3>
          
          <div class="form-field">
            <app-std-mdb-form-text
              prefix="test"
              name="name"
              label="Name *"
              [required]="true"
              placeholder="Enter your name"
              helpText="Required text field"
              formControlName="name">
            </app-std-mdb-form-text>
          </div>
          
          <div class="form-field">
            <app-std-mdb-form-textarea
              prefix="test"
              name="description"
              label="Description"
              [required]="false"
              placeholder="Enter description (MaxLength > 100)"
              helpText="Textarea for longer text"
              [rows]="4"
              [maxLength]="500"
              formControlName="description">
            </app-std-mdb-form-textarea>
          </div>
        </div>

        <!-- Date Values -->
        <div class="form-section">
          <h3>Date Values</h3>
          
          <div class="form-field">
            <app-std-mdb-datepicker
              prefix="test"
              name="birthDate"
              label="Birth Date *"
              [required]="true"
              placeholder="MM/DD/YYYY"
              helpText="Required date field"
              formControlName="birthDate">
            </app-std-mdb-datepicker>
          </div>
          
          <div class="form-field">
            <label class="form-label">Date Display (Read-only)</label>
            <app-dategetdata-display 
              [data]="sampleDateData" 
              modeName="date">
            </app-dategetdata-display>
            <div class="form-text">Sample DateGETData display</div>
          </div>
        </div>

        <!-- Boolean Values -->
        <div class="form-section">
          <h3>Boolean Values</h3>
          
          <div class="form-field">
            <app-std-boolean
              prefix="test"
              name="isActive"
              label="Active Status *"
              [required]="true"
              mode="checkbox"
              helpText="Required checkbox field"
              formControlName="isActive">
            </app-std-boolean>
          </div>
          
          <div class="form-field">
            <app-std-boolean
              prefix="test"
              name="hasLicense"
              label="Has License"
              [required]="false"
              mode="yesno"
              yesText="Yes"
              noText="No"
              helpText="Yes/No boolean field"
              formControlName="hasLicense">
            </app-std-boolean>
          </div>
        </div>

        <!-- Phone Values -->
        <div class="form-section">
          <h3>Phone Values</h3>
          
          <div class="form-field">
            <app-std-mdb-phone
              prefix="test"
              name="phone"
              label="Phone Number"
              [required]="false"
              placeholder="(123) 456-7890"
              helpText="Phone number field"
              formControlName="phone">
            </app-std-mdb-phone>
          </div>
        </div>

        <!-- Integer Values -->
        <div class="form-section">
          <h3>Integer Values</h3>
          
          <div class="form-field">
            <app-std-mdb-integer
              prefix="test"
              name="age"
              label="Age *"
              [required]="true"
              placeholder="Enter your age"
              helpText="Required integer field"
              [min]="0"
              [max]="120"
              formControlName="age">
            </app-std-mdb-integer>
          </div>
        </div>

        <!-- Menus -->
        <div class="form-section">
          <h3>Menus</h3>
          
          <div class="form-field">
            <label class="form-label">Country (Single Choice) *</label>
            <app-menu-control-data-list
              [menuControlDataList]="countryMenuData"
              placeholder="Select a country"
              (selectionChange)="onCountrySelectionChange($event)">
            </app-menu-control-data-list>
            <div class="form-text">Required single choice menu</div>
          </div>
          
          <div class="form-field">
            <label class="form-label">Skills (Multiple Choice)</label>
            <app-menu-control-data-list-m
              [menuControlDataList]="skillsMenuData"
              placeholder="Select skills"
              (selectionChange)="onSkillsSelectionChange($event)">
            </app-menu-control-data-list-m>
            <div class="form-text">Optional multiple choice menu</div>
          </div>
        </div>

        <!-- Available Field -->
        <div class="form-section">
          <h3>Available Field</h3>
          
          <div class="form-field">
            <app-available-selector
              [available]="availableValue"
              label="Available Status"
              (availableChange)="onAvailableChange($event)">
            </app-available-selector>
            <div class="form-text">Available selector field</div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="resetForm()">
            Reset Form
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="testForm.invalid">
            Submit Form
          </button>
        </div>
      </form>

      <div class="form-status" *ngIf="formSubmitted">
        <h3>Form Status</h3>
        <div class="status-info">
          <p><strong>Form Valid:</strong> {{ testForm.valid }}</p>
          <p><strong>Form Touched:</strong> {{ testForm.touched }}</p>
          <p><strong>Form Dirty:</strong> {{ testForm.dirty }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-header h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2rem;
    }

    .form-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .required-info {
      text-align: left;
      margin-top: 20px;
      padding: 15px;
      background: #e3f2fd;
      border-radius: 6px;
      border-left: 4px solid #2196f3;
    }

    .required-info h4 {
      color: #1976d2;
      margin-bottom: 10px;
      font-size: 1.1rem;
    }

    .required-info ul {
      margin: 0;
      padding-left: 20px;
    }

    .required-info li {
      margin-bottom: 5px;
      color: #424242;
    }

    .test-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-section {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      color: #495057;
      margin-bottom: 20px;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .form-field {
      margin-bottom: 20px;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 120px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
      transform: translateY(-1px);
    }

    .form-status {
      margin-top: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-status h3 {
      color: #333;
      margin-bottom: 15px;
    }

    .status-info p {
      margin: 8px 0;
      color: #666;
    }

    .status-info strong {
      color: #333;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .form-container {
        padding: 10px;
      }

      .test-form {
        padding: 20px;
      }

      .form-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 200px;
      }
    }

    /* Component-specific styling */
    ::ng-deep .form-field {
      margin-bottom: 15px;
    }

    ::ng-deep .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 5px;
      display: block;
    }

    ::ng-deep .form-control {
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 1rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    ::ng-deep .form-control:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    ::ng-deep .form-text {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 5px;
    }

    ::ng-deep .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    ::ng-deep .form-check {
      margin-bottom: 15px;
    }

    ::ng-deep .form-check-input {
      margin-right: 8px;
    }

    ::ng-deep .form-check-label {
      font-weight: 500;
      color: #495057;
    }
  `]
})
export class UistarterFormComponent {
  testForm: FormGroup;
  formSubmitted = false;

  // Sample data for components
  sampleDateData: DateGETData = {
    formattedDate: '2024-01-15',
    formattedDateTime: '2024-01-15 10:30:00',
    date: new Date('2024-01-15T00:00:00Z')
  };

  countryMenuData: MenuControlDataList = {
    menuName: 'Countries',
    label: 'Select Country',
    menuItems: [
      { id: 'us', name: 'United States', selected: false },
      { id: 'ca', name: 'Canada', selected: false },
      { id: 'uk', name: 'United Kingdom', selected: false },
      { id: 'de', name: 'Germany', selected: false },
      { id: 'fr', name: 'France', selected: false }
    ]
  };

  skillsMenuData: MenuControlDataList = {
    menuName: 'Skills',
    label: 'Select Skills',
    menuItems: [
      { id: 'js', name: 'JavaScript', selected: false },
      { id: 'ts', name: 'TypeScript', selected: false },
      { id: 'angular', name: 'Angular', selected: false },
      { id: 'react', name: 'React', selected: false },
      { id: 'vue', name: 'Vue.js', selected: false }
    ]
  };

  availableValue: number = 0;
  selectedCountry: MenuControlData | null = null;
  selectedSkills: MenuControlData[] = [];

  constructor(private fb: FormBuilder) {
    this.testForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      birthDate: ['', Validators.required],
      isActive: [false, Validators.requiredTrue],
      hasLicense: [false],
      phone: [''],
      age: [null, [Validators.required, Validators.min(0), Validators.max(120)]]
    });
  }

  onCountrySelectionChange(selectedItem: MenuControlData | null): void {
    this.selectedCountry = selectedItem;
    // Update form validation based on country selection
    if (selectedItem) {
      this.testForm.get('country')?.setValue(selectedItem.id);
    } else {
      this.testForm.get('country')?.setValue(null);
    }
  }

  onSkillsSelectionChange(selectedItems: MenuControlData[]): void {
    this.selectedSkills = selectedItems;
    // Update form with selected skill IDs
    const skillIds = selectedItems.map(item => item.id);
    this.testForm.get('skills')?.setValue(skillIds);
  }

  onAvailableChange(value: number): void {
    this.availableValue = value;
    this.testForm.get('available')?.setValue(value);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.testForm.valid && this.selectedCountry) {
      const formData = this.testForm.value;
      
      // Convert the form data to a clean JSON object
      const cleanData = {
        name: formData.name,
        description: formData.description || null,
        birthDate: formData.birthDate,
        isActive: formData.isActive,
        hasLicense: formData.hasLicense,
        phone: formData.phone || null,
        age: formData.age,
        country: this.selectedCountry?.id || null,
        countryName: this.selectedCountry?.name || null,
        skills: this.selectedSkills.map(skill => skill.id),
        skillNames: this.selectedSkills.map(skill => skill.name),
        available: this.availableValue
      };

      // Alert the JSON data
      alert('Form Data:\n\n' + JSON.stringify(cleanData, null, 2));
      
      console.log('Form submitted with data:', cleanData);
    } else {
      const formData = this.testForm.value;
      const missingFields: string[] = [];
      if (!formData.name) missingFields.push('Name');
      if (!formData.age) missingFields.push('Age');
      if (!formData.birthDate) missingFields.push('Birth Date');
      if (!formData.isActive) missingFields.push('Active Status');
      if (!this.selectedCountry) missingFields.push('Country');
      
      alert('Please fill in all required fields:\n\n' + missingFields.join('\n'));
      console.log('Form is invalid:', this.testForm.errors);
    }
  }

  resetForm(): void {
    this.testForm.reset();
    this.formSubmitted = false;
    this.selectedCountry = null;
    this.selectedSkills = [];
    this.availableValue = 0;
    
    // Reset to initial values
    this.testForm.patchValue({
      name: '',
      description: '',
      birthDate: '',
      isActive: false,
      hasLicense: false,
      phone: '',
      age: null
    });
  }
}
