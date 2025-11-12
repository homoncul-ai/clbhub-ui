import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTabsetComponent, SimpleTab } from '../../components/_global/simple-tabset/simple-tabset.component';

/**
 * Details component with all elements - heading, subheading, button bar, and tabset
 */
@Component({
  selector: 'app-details-all-elements-starter',
  template: `
    <div class="container mt-4">
      <h2>Student Details</h2>
      <h4 class="text-muted mb-3">Complete Information View</h4>
      
      <div class="mb-3">
        <button class="btn btn-primary me-2" (click)="onEdit()">Edit</button>
        <button class="btn btn-secondary me-2" (click)="onDelete()">Delete</button>
        <button class="btn btn-info me-2" (click)="onPrint()">Print</button>
        <button class="btn btn-success" (click)="onSave()">Save</button>
      </div>
      
      <app-simple-tabset [tabs]="tabs" [currentTabId]="currentTabId"></app-simple-tabset>
      
      <div *ngIf="currentTabId === 'overview'" class="mt-3">
        <div class="detail-section">
          <div class="detail-group">
            <label>Name:</label>
            <span>John Doe</span>
          </div>
          <div class="detail-group">
            <label>Business Code:</label>
            <span>STU001</span>
          </div>
          <div class="detail-group">
            <label>Email:</label>
            <span>john.doe&#64;example.com</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="currentTabId === 'contact'" class="mt-3">
        <div class="detail-section">
          <div class="detail-group">
            <label>Cell Phone:</label>
            <span>555-0101</span>
          </div>
          <div class="detail-group">
            <label>Work Phone:</label>
            <span>555-0102</span>
          </div>
          <div class="detail-group">
            <label>Address:</label>
            <span>123 Main St, City, State 12345</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="currentTabId === 'school'" class="mt-3">
        <div class="detail-section">
          <div class="detail-group">
            <label>School ID:</label>
            <span>SCH001</span>
          </div>
          <div class="detail-group">
            <label>School Name:</label>
            <span>Example High School</span>
          </div>
          <div class="detail-group">
            <label>Available:</label>
            <span>Yes</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent]
})
export class DetailsAllElementsStarterComponent {
  currentTabId: string = 'overview';
  tabs: SimpleTab[] = [
    new SimpleTab('overview', 'Overview', '', () => { this.currentTabId = 'overview'; }, () => true),
    new SimpleTab('contact', 'Contact', '', () => { this.currentTabId = 'contact'; }, () => true),
    new SimpleTab('school', 'School', '', () => { this.currentTabId = 'school'; }, () => true),
  ];

  onEdit() {
    alert('Edit clicked');
  }

  onDelete() {
    alert('Delete clicked');
  }

  onPrint() {
    alert('Print clicked');
  }

  onSave() {
    alert('Save clicked');
  }
}

