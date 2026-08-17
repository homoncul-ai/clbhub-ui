import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Placeholder for merged template instance search (PMergeTmplInstance).
 * Search UI will be added later.
 */
@Component({
  selector: 'app-pmergetmpl-instances-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pmerge-instances-placeholder">
      <h3 class="mb-2">Merged Instances</h3>
      <p class="text-muted mb-0">
        Search for merged documents will be available here.
      </p>
    </div>
  `,
  styles: [
    `
      .pmerge-instances-placeholder {
        padding: 1.5rem 0.25rem;
      }
    `,
  ],
})
export class PMergeTmplInstancesListComponent {}
