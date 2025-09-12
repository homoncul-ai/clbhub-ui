import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StdMdbEntitystateComponent } from './std-mdb-entitystate.component';
import { StateChangeFormResponse, MenuControlData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-std-mdb-entitystate-example',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbEntitystateComponent],
  template: `
    <div class="example-container">
      <h4>StdMdbEntitystateComponent Example</h4>
      
      <div class="example-section">
        <h5>Basic Usage</h5>
        <p>This example shows how to use the component with a WorkRequest entity:</p>
        
        <app-std-mdb-entitystate
          entityName="WorkRequest"
          entityId="12345"
          (stateChangeResponse)="onStateChangeResponse($event)"
          (menuItemSelected)="onMenuItemSelected($event)">
        </app-std-mdb-entitystate>
      </div>

      <div class="example-section">
        <h5>Manual Control</h5>
        <p>This example shows manual control without automatic setup:</p>
        
        <div class="manual-controls mb-3">
          <input 
            type="text" 
            [(ngModel)]="entityName" 
            placeholder="Entity Name" 
            class="form-control me-2 d-inline-block w-auto">
          <input 
            type="text" 
            [(ngModel)]="entityId" 
            placeholder="Entity ID" 
            class="form-control me-2 d-inline-block w-auto">
          <button 
            type="button" 
            class="btn btn-primary" 
            (click)="loadStateChanges()">
            Load State Changes
          </button>
        </div>
        
        <app-std-mdb-entitystate
          [entityName]="entityName"
          [entityId]="entityId"
          [callChangeSetupUI]="false"
          (stateChangeResponse)="onStateChangeResponse($event)"
          (menuItemSelected)="onMenuItemSelected($event)">
        </app-std-mdb-entitystate>
      </div>

      <div class="example-section" *ngIf="lastResponse">
        <h5>Last Response</h5>
        <div class="response-info">
          <p><strong>Entity Type:</strong> {{ lastResponse.context?.entityType }}</p>
          <p><strong>Entity ID:</strong> {{ lastResponse.context?.entityId }}</p>
          <p><strong>Available Transitions:</strong> {{ lastResponse.nextStatesMenu?.menuItems?.length || 0 }}</p>
        </div>
      </div>

      <div class="example-section" *ngIf="lastSelectedItem">
        <h5>Last Selected Item</h5>
        <div class="selected-item-info">
          <p><strong>ID:</strong> {{ lastSelectedItem.id }}</p>
          <p><strong>Name:</strong> {{ lastSelectedItem.name }}</p>
          <p><strong>Help Text:</strong> {{ lastSelectedItem.helpText }}</p>
          <p><strong>Allowed:</strong> {{ lastSelectedItem.allowedByRule ? 'Yes' : 'No' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .example-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      background-color: #f8f9fa;
    }

    .example-section h5 {
      color: #495057;
      margin-bottom: 1rem;
    }

    .manual-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .response-info,
    .selected-item-info {
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }

    .response-info p,
    .selected-item-info p {
      margin-bottom: 0.5rem;
    }

    .response-info p:last-child,
    .selected-item-info p:last-child {
      margin-bottom: 0;
    }
  `]
})
export class StdMdbEntitystateExampleComponent {
  entityName: string = 'WorkRequest';
  entityId: string = '12345';
  lastResponse: StateChangeFormResponse | null = null;
  lastSelectedItem: MenuControlData | null = null;

  onStateChangeResponse(response: StateChangeFormResponse): void {
    console.log('State change response received:', response);
    this.lastResponse = response;
  }

  onMenuItemSelected(menuItem: MenuControlData): void {
    console.log('Menu item selected:', menuItem);
    this.lastSelectedItem = menuItem;
  }

  loadStateChanges(): void {
    // This will trigger the component to load state changes
    // The component will handle the actual API call
  }
}
