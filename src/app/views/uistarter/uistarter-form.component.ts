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
    StdMdbPhoneComponent
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>Input Components Test Form</h2>
        <p>Test all the standard input components in one form</p>
      </div>

      <form [formGroup]="testForm" (ngSubmit)="onSubmit()" class="test-form">
        <div class="form-section">
          <h3>Text Inputs</h3>
          
          <div class="form-row">
            <div class="form-field">
              <app-std-mdb-form-text
                prefix="test"
                name="firstName"
                label="First Name"
                [required]="true"
                placeholder="Enter your first name"
                helpText="This is a required text field"
                formControlName="firstName">
              </app-std-mdb-form-text>
            </div>
            
            <div class="form-field">
              <app-std-mdb-form-text
                prefix="test"
                name="lastName"
                label="Last Name"
                [required]="true"
                placeholder="Enter your last name"
                helpText="This is also required"
                formControlName="lastName">
              </app-std-mdb-form-text>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <app-std-mdb-form-text
                prefix="test"
                name="email"
                label="Email Address"
                [required]="true"
                placeholder="Enter your email"
                helpText="We'll use this to contact you"
                formControlName="email">
              </app-std-mdb-form-text>
            </div>
            
            <div class="form-field">
              <app-std-mdb-phone
                prefix="test"
                name="phone"
                label="Phone Number"
                [required]="false"
                placeholder="(123) 456-7890"
                helpText="Optional phone number"
                formControlName="phone">
              </app-std-mdb-phone>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Numeric Input</h3>
          
          <div class="form-row">
            <div class="form-field">
              <app-std-mdb-integer
                prefix="test"
                name="age"
                label="Age"
                [required]="true"
                placeholder="Enter your age"
                helpText="Must be a valid integer"
                [min]="0"
                [max]="120"
                formControlName="age">
              </app-std-mdb-integer>
            </div>
            
            <div class="form-field">
              <app-std-mdb-integer
                prefix="test"
                name="salary"
                label="Salary"
                [required]="false"
                placeholder="Enter salary"
                helpText="Optional salary information"
                [min]="0"
                formControlName="salary">
              </app-std-mdb-integer>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Date Input</h3>
          
          <div class="form-row">
            <div class="form-field">
              <app-std-mdb-datepicker
                prefix="test"
                name="birthDate"
                label="Birth Date"
                [required]="true"
                placeholder="MM/DD/YYYY"
                helpText="Select your birth date"
                formControlName="birthDate">
              </app-std-mdb-datepicker>
            </div>
            
            <div class="form-field">
              <app-std-mdb-datepicker
                prefix="test"
                name="startDate"
                label="Start Date"
                [required]="false"
                placeholder="MM/DD/YYYY"
                helpText="Optional start date"
                formControlName="startDate">
              </app-std-mdb-datepicker>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Boolean Inputs</h3>
          
          <div class="form-row">
            <div class="form-field">
              <app-std-boolean
                prefix="test"
                name="isActive"
                label="Active Status"
                [required]="true"
                mode="checkbox"
                helpText="Check if you are active"
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
                helpText="Do you have a valid license?"
                formControlName="hasLicense">
              </app-std-boolean>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Text Area</h3>
          
          <div class="form-row">
            <div class="form-field full-width">
              <app-std-mdb-form-textarea
                prefix="test"
                name="comments"
                label="Comments"
                [required]="false"
                placeholder="Enter any additional comments"
                helpText="Optional comments or notes"
                [rows]="4"
                [maxLength]="500"
                formControlName="comments">
              </app-std-mdb-form-textarea>
            </div>
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
      max-width: 1200px;
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

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-field {
      flex: 1;
      min-width: 0;
    }

    .form-field.full-width {
      flex: 1 1 100%;
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

      .form-row {
        flex-direction: column;
        gap: 15px;
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

  constructor(private fb: FormBuilder) {
    this.testForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      age: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
      salary: [null, [Validators.min(0)]],
      birthDate: ['', Validators.required],
      startDate: [''],
      isActive: [false, Validators.requiredTrue],
      hasLicense: [false],
      comments: ['']
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.testForm.valid) {
      const formData = this.testForm.value;
      
      // Convert the form data to a clean JSON object
      const cleanData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        age: formData.age,
        salary: formData.salary || null,
        birthDate: formData.birthDate,
        startDate: formData.startDate || null,
        isActive: formData.isActive,
        hasLicense: formData.hasLicense,
        comments: formData.comments || null
      };

      // Alert the JSON data
      alert('Form Data:\n\n' + JSON.stringify(cleanData, null, 2));
      
      console.log('Form submitted with data:', cleanData);
    } else {
      alert('Please fill in all required fields correctly.');
      console.log('Form is invalid:', this.testForm.errors);
    }
  }

  resetForm(): void {
    this.testForm.reset();
    this.formSubmitted = false;
    
    // Reset to initial values
    this.testForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: null,
      salary: null,
      birthDate: '',
      startDate: '',
      isActive: false,
      hasLicense: false,
      comments: ''
    });
  }
}
