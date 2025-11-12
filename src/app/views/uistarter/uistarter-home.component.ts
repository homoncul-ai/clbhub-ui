import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BubaDemoComponent } from '../../components/_global/std-buba/buba-demo.component';

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

      <app-buba-demo></app-buba-demo>
      
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
  imports: [CommonModule, BubaDemoComponent]
})
export class UistarterHomeComponent {
  starterComponents: StarterComponent[] = [
    {
      menuItem: 'UI Starter List Search',
      link: '/advocate-dashboard/uistarter/list-search-starter',
      label: 'List with Searchbar',
      route: '/advocate-dashboard/uistarter/list-search-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'list-search-starter'
    },
    {
      menuItem: 'UI Starter List',
      link: '/advocate-dashboard/uistarter/list-starter',
      label: 'Basic List',
      route: '/advocate-dashboard/uistarter/list-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'list-starter'
    },
    {
      menuItem: 'UI Starter Details',
      link: '/advocate-dashboard/uistarter/details-starter',
      label: 'Basic Details',
      route: '/advocate-dashboard/uistarter/details-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'details-starter'
    },
    {
      menuItem: 'UI Starter Details 2 Column',
      link: '/advocate-dashboard/uistarter/details-2col-starter',
      label: 'Details 2 Column',
      route: '/advocate-dashboard/uistarter/details-2col-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'details-2col-starter'
    },
    {
      menuItem: 'UI Starter Details Accordion',
      link: '/advocate-dashboard/uistarter/details-accordion-starter',
      label: 'Details Accordion',
      route: '/advocate-dashboard/uistarter/details-accordion-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'details-accordion-starter'
    },
    {
      menuItem: 'UI Starter Details All Elements',
      link: '/advocate-dashboard/uistarter/details-all-elements-starter',
      label: 'Details All Elements',
      route: '/advocate-dashboard/uistarter/details-all-elements-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'details-all-elements-starter'
    },
    {
      menuItem: 'UI Starter Edit',
      link: '/advocate-dashboard/uistarter/edit-starter',
      label: 'Basic Edit Form',
      route: '/advocate-dashboard/uistarter/edit-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'edit-starter'
    },
    {
      menuItem: 'UI Starter Edit 2 Column',
      link: '/advocate-dashboard/uistarter/edit-2col-starter',
      label: 'Edit Form 2 Column',
      route: '/advocate-dashboard/uistarter/edit-2col-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'edit-2col-starter'
    },
    {
      menuItem: 'UI Starter Edit All Elements',
      link: '/advocate-dashboard/uistarter/edit-all-elements-starter',
      label: 'Edit Form All Elements',
      route: '/advocate-dashboard/uistarter/edit-all-elements-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'edit-all-elements-starter'
    },
    {
      menuItem: 'UI Starter Form Test',
      link: '/advocate-dashboard/uistarter/form-test',
      label: 'Input Components Test Form',
      route: '/advocate-dashboard/uistarter/form-test',
      componentPath: 'src/app/views/uistarter',
      componentName: 'uistarter-form'
    },
    {
      menuItem: 'UI Starter Dashboard Cardlist',
      link: '/advocate-dashboard/uistarter/dash-cardlist-starter',
      label: 'Dashboard Cardlist (Kanban)',
      route: '/advocate-dashboard/uistarter/dash-cardlist-starter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'dash-cardlist-starter'
    }
  ];

  constructor(private router: Router) {}

  navigateToComponent(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
} 