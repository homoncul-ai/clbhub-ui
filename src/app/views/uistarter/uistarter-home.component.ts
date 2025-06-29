import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface StarterComponent {
  menuItem: string;
  link: string;
  label: string;
  route: string;
  componentPath: string;
  componentName: string;
}

@Component({
  selector: 'app-uistarter-home',
  template: `
    <div class="container mt-4">
      <h2>UI Starter Components</h2>
      <p class="text-muted mb-4">A collection of starter components for development and testing</p>
      
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>&nbsp;</th>
              <th>Label</th>
              <th>Route</th>
              <!-- <th>Component Path</th> -->
              <th>Component Name</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let component of starterComponents">
            <td>
                <button 
                  class="btn btn-primary btn-sm" 
                  (click)="navigateToComponent(component.route)"
                  [disabled]="!component.route">
                  Go
                </button>
              </td>
              <td>{{ component.label }}</td>
              <td><code>{{ component.route }}</code></td>
              <!-- <td><code>{{ component.componentPath }}</code></td> -->
              <td><code>{{ component.componentName }}</code></td>
             
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4">
        <div class="alert alert-info">
          <strong>Note:</strong> Click the "Go" button to navigate to each starter component.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-responsive {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .table th {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    
    .table td {
      vertical-align: middle;
    }
    
    code {
      background-color: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #e83e8c;
    }
    
    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }
    
    .alert {
      border-left: 4px solid #17a2b8;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class UistarterHomeComponent {
  starterComponents: StarterComponent[] = [
    {
      menuItem: 'UI Starter List Search',
      link: '/advocate-dashboard/uistarter/list-search-starter',
      label: 'UIStarter List Search',
      route: '/advocate-dashboard/uistarter/list-search-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'list-search-starter'
    }
  ];

  constructor(private router: Router) {}

  navigateToComponent(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
} 