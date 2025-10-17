import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StdBubaComponent } from './std-buba.component';

@Component({
  selector: 'app-buba-demo',
  standalone: true,
  imports: [CommonModule, StdBubaComponent],
  template: `
    <div class="buba-demo">
      <h2>Buba Component Demo</h2>
      
      <div class="demo-section">
        <h3>Student Buba</h3>
        <app-std-buba 
          entityName="Student" 
          entityId="12345"
          profileTypeCode="STUDENT_PROFILE"
          aspect="academic">
        </app-std-buba>
      </div>

      <div class="demo-section">
        <h3>School Buba</h3>
        <app-std-buba 
          entityName="School" 
          entityId="SCH001"
          cssClass="custom-school-buba">
        </app-std-buba>
      </div>

      <div class="demo-section">
        <h3>Provider Buba</h3>
        <app-std-buba 
          entityName="Provider" 
          entityId="PROV789"
          profileTypeCode="HEALTHCARE_PROVIDER">
        </app-std-buba>
      </div>

      <div class="demo-section">
        <h3>Work Request Buba</h3>
        <app-std-buba 
          entityName="WorkRequest" 
          entityId="WR-2024-001"
          showIcon="true"
          showTooltip="true">
        </app-std-buba>
      </div>

      <div class="demo-section">
        <h3>Buba without Icon</h3>
        <app-std-buba 
          entityName="Catalog" 
          entityId="CAT-001"
          [showIcon]="false">
        </app-std-buba>
      </div>

      <div class="demo-section">
        <h3>Buba without Tooltip</h3>
        <app-std-buba 
          entityName="User" 
          entityId="USER-456"
          [showTooltip]="false">
        </app-std-buba>
      </div>
    </div>
  `,
  styles: [`
    .buba-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      background-color: #f8f9fa;
    }

    .demo-section h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #495057;
    }

    .custom-school-buba {
      background-color: #e3f2fd;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
  `]
})
export class BubaDemoComponent {
}
