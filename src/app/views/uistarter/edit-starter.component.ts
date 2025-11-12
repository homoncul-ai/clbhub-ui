import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Basic edit form component
 */
@Component({
  selector: 'app-edit-starter',
  template: `
    <div class="container mt-4">
      <h2>Edit Student</h2>
      
      <form>
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" [(ngModel)]="formData.name" name="name">
        </div>
        
        <div class="mb-3">
          <label for="businessCode" class="form-label">Business Code</label>
          <input type="text" class="form-control" id="businessCode" [(ngModel)]="formData.businessCode" name="businessCode">
        </div>
        
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" [(ngModel)]="formData.email" name="email">
        </div>
        
        <div class="mb-3">
          <label for="cellPhone" class="form-label">Cell Phone</label>
          <input type="tel" class="form-control" id="cellPhone" [(ngModel)]="formData.cellPhone" name="cellPhone">
        </div>
        
        <div class="mb-3">
          <label for="workPhone" class="form-label">Work Phone</label>
          <input type="tel" class="form-control" id="workPhone" [(ngModel)]="formData.workPhone" name="workPhone">
        </div>
        
        <div class="mb-3">
          <label for="schoolId" class="form-label">School ID</label>
          <input type="text" class="form-control" id="schoolId" [(ngModel)]="formData.schoolId" name="schoolId">
        </div>
        
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="available" [(ngModel)]="formData.available" name="available">
            <label class="form-check-label" for="available">
              Available
            </label>
          </div>
        </div>
        
        <div class="mb-3">
          <button type="button" class="btn btn-primary" (click)="onSave()">Save</button>
          <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditStarterComponent {
  formData = {
    name: 'John Doe',
    businessCode: 'STU001',
    email: 'john.doe@example.com',
    cellPhone: '555-0101',
    workPhone: '555-0102',
    schoolId: 'SCH001',
    available: true
  };

  onSave() {
    alert('Save clicked: ' + JSON.stringify(this.formData));
  }

  onCancel() {
    alert('Cancel clicked');
  }
}

