import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Edit form component with all input elements
 */
@Component({
  selector: 'app-edit-all-elements-starter',
  template: `
    <div class="container mt-4">
      <h2>Edit Student - All Elements</h2>
      
      <form>
        <!-- Text Inputs -->
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" [(ngModel)]="formData.name" name="name">
        </div>
        
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" [(ngModel)]="formData.email" name="email">
        </div>
        
        <!-- Textarea -->
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" rows="3" [(ngModel)]="formData.description" name="description"></textarea>
        </div>
        
        <!-- Number Input -->
        <div class="mb-3">
          <label for="age" class="form-label">Age</label>
          <input type="number" class="form-control" id="age" [(ngModel)]="formData.age" name="age">
        </div>
        
        <!-- Date Input -->
        <div class="mb-3">
          <label for="birthDate" class="form-label">Birth Date</label>
          <input type="date" class="form-control" id="birthDate" [(ngModel)]="formData.birthDate" name="birthDate">
        </div>
        
        <!-- Select Dropdown -->
        <div class="mb-3">
          <label for="status" class="form-label">Status</label>
          <select class="form-select" id="status" [(ngModel)]="formData.status" name="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <!-- Radio Buttons -->
        <div class="mb-3">
          <label class="form-label">Gender</label>
          <div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="genderMale" value="male" [(ngModel)]="formData.gender" name="gender">
              <label class="form-check-label" for="genderMale">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="genderFemale" value="female" [(ngModel)]="formData.gender" name="gender">
              <label class="form-check-label" for="genderFemale">Female</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="genderOther" value="other" [(ngModel)]="formData.gender" name="gender">
              <label class="form-check-label" for="genderOther">Other</label>
            </div>
          </div>
        </div>
        
        <!-- Checkboxes -->
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="available" [(ngModel)]="formData.available" name="available">
            <label class="form-check-label" for="available">
              Available
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="newsletter" [(ngModel)]="formData.newsletter" name="newsletter">
            <label class="form-check-label" for="newsletter">
              Subscribe to Newsletter
            </label>
          </div>
        </div>
        
        <!-- Range Input -->
        <div class="mb-3">
          <label for="rating" class="form-label">Rating: {{ formData.rating }}</label>
          <input type="range" class="form-range" id="rating" min="0" max="10" [(ngModel)]="formData.rating" name="rating">
        </div>
        
        <!-- Color Input -->
        <div class="mb-3">
          <label for="favoriteColor" class="form-label">Favorite Color</label>
          <input type="color" class="form-control form-control-color" id="favoriteColor" [(ngModel)]="formData.favoriteColor" name="favoriteColor">
        </div>
        
        <!-- File Input -->
        <div class="mb-3">
          <label for="photo" class="form-label">Photo</label>
          <input type="file" class="form-control" id="photo" name="photo">
        </div>
        
        <!-- Buttons -->
        <div class="mb-3">
          <button type="button" class="btn btn-primary" (click)="onSave()">Save</button>
          <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
          <button type="button" class="btn btn-info ms-2" (click)="onReset()">Reset</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditAllElementsStarterComponent {
  formData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    description: 'Student description here',
    age: 20,
    birthDate: '2004-01-15',
    status: 'active',
    gender: 'male',
    available: true,
    newsletter: false,
    rating: 7,
    favoriteColor: '#0000ff'
  };

  onSave() {
    alert('Save clicked: ' + JSON.stringify(this.formData));
  }

  onCancel() {
    alert('Cancel clicked');
  }

  onReset() {
    this.formData = {
      name: '',
      email: '',
      description: '',
      age: 0,
      birthDate: '',
      status: 'active',
      gender: 'male',
      available: false,
      newsletter: false,
      rating: 5,
      favoriteColor: '#000000'
    };
  }
}

