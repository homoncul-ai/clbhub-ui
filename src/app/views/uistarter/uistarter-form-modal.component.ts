import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
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

export interface FormModalData {
  name?: string;
  description?: string;
  birthDate?: string;
  isActive?: boolean;
  hasLicense?: boolean;
  phone?: string;
  age?: number | null;
  country?: MenuControlData | null;
  skills?: MenuControlData[];
  available?: number;
}

@Component({
  selector: 'app-uistarter-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbModalModule,
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
    <div class="modal-header">
      <h5 class="modal-title">Field Display Components Test Form (Modal)</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>

    <div class="modal-body">
      <div class="form-header">
        <p>Test all field types from field-display-guides-component.prompt.txt in a modal</p>
        <div class="required-info">
          <h6>Required Fields for Form Submission:</h6>
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
          <h6>String Values</h6>
          
          <div class="form-field">
            <app-std-mdb-form-text
              prefix="modal"
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
              prefix="modal"
              name="description"
              label="Description"
              [required]="false"
              placeholder="Enter description (MaxLength > 100)"
              helpText="Textarea for longer text"
              [rows]="3"
              [maxLength]="500"
              formControlName="description">
            </app-std-mdb-form-textarea>
          </div>
        </div>

        <!-- Date Values -->
        <div class="form-section">
          <h6>Date Values</h6>
          
          <div class="form-field">
            <app-std-mdb-datepicker
              prefix="modal"
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
          <h6>Boolean Values</h6>
          
          <div class="form-field">
            <app-std-boolean
              prefix="modal"
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
              prefix="modal"
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
          <h6>Phone Values</h6>
          
          <div class="form-field">
            <app-std-mdb-phone
              prefix="modal"
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
          <h6>Integer Values</h6>
          
          <div class="form-field">
            <app-std-mdb-integer
              prefix="modal"
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
          <h6>Menus</h6>
          
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
          <h6>Available Field</h6>
          
          <div class="form-field">
            <app-available-selector
              [available]="availableValue"
              label="Available Status"
              (availableChange)="onAvailableChange($event)">
            </app-available-selector>
            <div class="form-text">Available selector field</div>
          </div>
        </div>

        <div class="form-status" *ngIf="formSubmitted">
          <h6>Form Status</h6>
          <div class="status-info">
            <p><strong>Form Valid:</strong> {{ testForm.valid }}</p>
            <p><strong>Form Touched:</strong> {{ testForm.touched }}</p>
            <p><strong>Form Dirty:</strong> {{ testForm.dirty }}</p>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="resetForm()">
        Reset Form
      </button>
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Close
      </button>
      <button type="button" class="btn btn-primary" (click)="onSubmit()" [disabled]="testForm.invalid || !selectedCountry">
        Submit Form
      </button>
    </div>
  `,
  styles: [`
    .modal-body {
      max-height: 70vh;
      overflow-y: auto;
      padding: 20px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .form-header p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    .required-info {
      text-align: left;
      padding: 10px;
      background: #e3f2fd;
      border-radius: 4px;
      border-left: 3px solid #2196f3;
    }

    .required-info h6 {
      color: #1976d2;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .required-info ul {
      margin: 0;
      padding-left: 15px;
    }

    .required-info li {
      margin-bottom: 3px;
      color: #424242;
      font-size: 0.8rem;
    }

    .test-form {
      background: white;
    }

    .form-section {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h6 {
      color: #495057;
      margin-bottom: 15px;
      font-size: 1rem;
      font-weight: 600;
    }

    .form-field {
      margin-bottom: 15px;
    }

    .form-status {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .form-status h6 {
      color: #333;
      margin-bottom: 10px;
      font-size: 0.9rem;
    }

    .status-info p {
      margin: 5px 0;
      color: #666;
      font-size: 0.8rem;
    }

    .status-info strong {
      color: #333;
    }

    /* Component-specific styling */
    ::ng-deep .form-field {
      margin-bottom: 12px;
    }

    ::ng-deep .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 4px;
      display: block;
      font-size: 0.9rem;
    }

    ::ng-deep .form-control {
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 0.9rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    ::ng-deep .form-control:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    ::ng-deep .form-text {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 4px;
    }

    ::ng-deep .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #dc3545;
    }

    ::ng-deep .form-check {
      margin-bottom: 12px;
    }

    ::ng-deep .form-check-input {
      margin-right: 6px;
    }

    ::ng-deep .form-check-label {
      font-weight: 500;
      color: #495057;
      font-size: 0.9rem;
    }

    .modal-footer {
      border-top: 1px solid #dee2e6;
      padding: 15px 20px;
    }

    .modal-footer .btn {
      margin-left: 8px;
    }
  `]
})
export class UistarterFormModalComponent implements OnInit {
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

  @Input() initialData: FormModalData = {};
  @Output() formDataSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    public modalRef: MdbModalRef<UistarterFormModalComponent>
  ) {
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

  ngOnInit(): void {
    // Initialize form with data from parent component
    if (this.initialData) {
      this.testForm.patchValue({
        name: this.initialData.name || '',
        description: this.initialData.description || '',
        birthDate: this.initialData.birthDate || '',
        isActive: this.initialData.isActive || false,
        hasLicense: this.initialData.hasLicense || false,
        phone: this.initialData.phone || '',
        age: this.initialData.age || null
      });

      // Set non-form values
      this.selectedCountry = this.initialData.country || null;
      this.selectedSkills = this.initialData.skills || [];
      this.availableValue = this.initialData.available || 0;

      // Update menu selections
      if (this.selectedCountry) {
        this.countryMenuData.menuItems?.forEach(item => {
          item.selected = item.id === this.selectedCountry?.id;
        });
      }

      if (this.selectedSkills.length > 0) {
        this.skillsMenuData.menuItems?.forEach(item => {
          item.selected = this.selectedSkills.some(skill => skill.id === item.id);
        });
      }
    }
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

      // Emit the form data
      this.formDataSubmitted.emit(cleanData);
      
      // Alert the JSON data
      alert('Modal Form Data:\n\n' + JSON.stringify(cleanData, null, 2));
      
      console.log('Modal form submitted with data:', cleanData);
      
      // Close the modal
      this.closeModal();
    } else {
      const formData = this.testForm.value;
      const missingFields: string[] = [];
      if (!formData.name) missingFields.push('Name');
      if (!formData.age) missingFields.push('Age');
      if (!formData.birthDate) missingFields.push('Birth Date');
      if (!formData.isActive) missingFields.push('Active Status');
      if (!this.selectedCountry) missingFields.push('Country');
      
      alert('Please fill in all required fields:\n\n' + missingFields.join('\n'));
      console.log('Modal form is invalid:', this.testForm.errors);
    }
  }

  resetForm(): void {
    this.testForm.reset();
    this.formSubmitted = false;
    this.selectedCountry = null;
    this.selectedSkills = [];
    this.availableValue = 0;
    
    // Reset menu selections
    this.countryMenuData.menuItems?.forEach(item => item.selected = false);
    this.skillsMenuData.menuItems?.forEach(item => item.selected = false);
    
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

  closeModal(): void {
    this.modalClosed.emit();
    this.modalRef.close();
  }
}
